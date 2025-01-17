from django.http import JsonResponse
from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from message.utilis import notification_send
from payment import utilis
from payment import models
from users.models import UserExtended
from payment import serializers
from django.conf import settings
from users.utilis import send_html_mail
import stripe

from users.utilis import put_owner_in_request_data

stripe.api_key = settings.STRIPE_SECRET_KEY


@api_view(['POST'])
@permission_classes([AllowAny])
def offer_all(request):
    offers = models.Offer.objects.all()
    result = []
    for offer in offers:
        serializer = serializers.OfferSerializer(instance=offer)
        result.append(serializer.data)
    return JsonResponse(result, safe=False)


@api_view(['POST'])
def transaction_all(request):
    transactions = models.Transaction.objects.filter(user=request.user)
    result = []
    for transaction in transactions:
        serializer = serializers.TransactionSerializer(instance=transaction)
        result.append(serializer.data)
    return JsonResponse(result, safe=False)


@api_view(['POST'])
def stripepk(request):
    stripepk = {'stripepk': settings.STRIPE_PUBLISHABLE_KEY}
    return JsonResponse(stripepk, safe=False)


@api_view(['POST'])
def create_checkout_session(request):
    user = request.user
    cus = user.stripe_customer_id
    if cus == None:
        customer = stripe.Customer.create(
            email=user.email,
            name=(user.first_name + ' ' + user.last_name)
        )
        user.stripe_customer_id = customer['id']
        user.save()
    else:
        customer = stripe.Customer.retrieve(cus)

    try:
        checkout_session = stripe.checkout.Session.create(
            line_items=[
                {
                    'price': request.data['stripeprice'],
                    'quantity': 1,
                },
            ],
            customer=customer['id'],
            mode='payment',
            success_url='https://pgym.xyz/',
            cancel_url='https://pgym.xyz/',
        )
    except Exception as e:
        print(e)
        return Response(status=400)

    return JsonResponse({'url': checkout_session.url}, safe=False)


@api_view(['POST'])
@authentication_classes([])
@permission_classes([AllowAny])
def stripe_webhook(request):
    payload = request.body
    endpoint_secret = "whsec_2NCkI7lwrop4nScVpALKfx3xcY5g94ww"
    event = None
    sig_header = request.headers['STRIPE_SIGNATURE']
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, endpoint_secret
        )
    except ValueError as e:
        # Invalid payload
        raise (e)
    except stripe.error.SignatureVerificationError as e:
        # Invalid signature
        raise (e)

    if event['type'] == 'checkout.session.completed':
        returned_session = event['data']['object']
        user_email = returned_session['customer_details']['email']
        session = stripe.checkout.Session.retrieve(
            returned_session['id'], expand=['line_items']
        )
        # print(session)
        if session['status'] == 'complete' and session['payment_status'] == 'paid':
            payment_intent = session['payment_intent']
            stripe_price_id = session['line_items']['data'][0]['price']['id']
            offer = models.Offer.objects.get(stripe_price_id=stripe_price_id)
            user = UserExtended.objects.get(email=user_email)
            transaction = utilis.create_transaction(user=user, offer_id=offer.id, stripe_pi_id=payment_intent)
            html_message = utilis.generate_purchase_confirmation_email_body(transaction.purchased,
                                                                            transaction.transaction_id)
            send_html_mail("PGYM - Zakup Gymcoinów", html_message, user_email)
            notification_send(user=user, body={'message': f"Otrzymałeś {offer.coins} monet"}, kind=8)
    else:
        print("Unhandled event type {}".format(event['type']))

    return Response(status=200)


def withdraw_money(owner, amount):
    if owner.money < amount:
        return None
    owner.money -= amount
    owner.save()
    withDraw = models.Withdraw.objects.create(owner=owner, amount=amount)
    return withDraw


@api_view(['POST'])
def withdraw_create(request):
    request = put_owner_in_request_data(request)
    amount = int(request.data['amount'])
    withdraw_instance = withdraw_money(owner=request.user, amount=amount)
    if withdraw_instance is None:
        Response("Not sufficient money", status=status.HTTP_400_BAD_REQUEST)
    return JsonResponse({'id': withdraw_instance.id}, safe=False)


@api_view(['POST'])
def withdraw_get(request):
    month = request.data['month']
    year = request.data['year']
    withdraw_instances = models.Withdraw.objects.filter(date__year=year, date__month=month)
    result = []
    for x in withdraw_instances:
        result.append({
            'id': x.id,
            'date': x.date,
            'bank_account': x.owner.bank_account,
            'first_name': x.owner.first_name,
            'last_name': x.owner.last_name,
            'amount_gymcoins': x.amount,
            'amount_zloty': x.amount / 100,
        })
    return JsonResponse(result, safe=False)

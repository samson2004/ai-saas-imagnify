import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { clerkClient, WebhookEvent } from '@clerk/nextjs/server'
import { createUser, deleteUser, updateUser } from '@/lib/actions/user.actions'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the endpoint
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
  }

  // Get the headers
  const headerPayload = headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400,
    })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET)

  let evt: WebhookEvent

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error occured', {
      status: 400,
    })
  }

  // Do something with the payload
  // For this guide, you simply log the payload to the console
  const { id } = evt.data
  const eventType = evt.type
  console.log(evt.data)
  console.log(evt.type)

 // CREATE
 if (eventType === "user.created") {
  const { id, email_addresses, image_url, first_name, last_name, username } = evt.data;

  const user = {
    clerkId: id,
    email: email_addresses[0].email_address,
    username: username!,
    firstname: first_name??"jake",
    lastname: last_name??"jake",
    photo: image_url,
  };

  const newUser = await createUser(user);

  // Set public metadata
  if (newUser) {
    await clerkClient.users.updateUserMetadata(id, {
      publicMetadata: {
        userId: newUser._id,
      },
    });
  }

  return NextResponse.json({ message: "OK", user: newUser });
}

// UPDATE
if (eventType === "user.updated") {
  const { id, image_url, first_name, last_name, username } = evt.data;

  const user = {
    firstname: first_name??"jake",
    lastname: last_name??"jake",
    username: username!,
    photo: image_url,
  };

  const updatedUser = await updateUser(id, user);

  return NextResponse.json({ message: "OK", user: updatedUser });
}

// DELETE
if (eventType === "user.deleted") {
  const { id } = evt.data;

  const deletedUser = await deleteUser(id!);

  return NextResponse.json({ message: "OK", user: deletedUser });
}

  console.log(`Webhook with and ID of ${id} and type of ${eventType}`)
  console.log('Webhook body:', body)

  return new Response('', { status: 200 })
}



//user.created
// {
//   "data": {
//     "birthday": "",
//     "created_at": 1654012591514,
//     "email_addresses": [
//       {
//         "email_address": "example@example.org",
//         "id": "idn_29w83yL7CwVlJXylYLxcslromF1",
//         "linked_to": [],
//         "object": "email_address",
//         "verification": {
//           "status": "verified",
//           "strategy": "ticket"
//         }
//       }
//     ],
//     "external_accounts": [],
//     "external_id": "567772",
//     "first_name": "Example",
//     "gender": "",
//     "id": "user_29w83sxmDNGwOuEthce5gg56FcC",
//     "image_url": "https://img.clerk.com/xxxxxx",
//     "last_name": "Example",
//     "last_sign_in_at": 1654012591514,
//     "object": "user",
//     "password_enabled": true,
//     "phone_numbers": [],
//     "primary_email_address_id": "idn_29w83yL7CwVlJXylYLxcslromF1",
//     "primary_phone_number_id": null,
//     "primary_web3_wallet_id": null,
//     "private_metadata": {},
//     "profile_image_url": "https://www.gravatar.com/avatar?d=mp",
//     "public_metadata": {},
//     "two_factor_enabled": false,
//     "unsafe_metadata": {},
//     "updated_at": 1654012591835,
//     "username": null,
//     "web3_wallets": []
//   },
//   "event_attributes": {
//     "http_request": {
//       "client_ip": "0.0.0.0",
//       "user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
//     }
//   },
//   "object": "event",
//   "timestamp": 1654012591835,
//   "type": "user.created"
// }
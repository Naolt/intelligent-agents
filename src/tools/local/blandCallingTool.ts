import { getDatabase } from "@/config/database";
import { environment } from "@/config/environment";
import { getCallMode } from "@/repositories/aiCallSettingRepository";
import { tool } from "@langchain/core/tools";
import { threadId } from "worker_threads";
import { z } from "zod";

const bookingCallSchema = z.object({
  restaurantName: z.string().describe("The name of the restaurant"),
  phoneNumber: z.string().describe("The phone number of the restaurant"),
  date: z.string().describe("The date of the reservation"),
  time: z.string().describe("The time of the reservation"),
  numberOfPeople: z
    .number()
    .describe("The number of people in the reservation"),
  seatingPreferences: z
    .string()
    .optional()
    .describe("The seating preferences of the reservation"),
  user: z.object({
    id: z.string().describe("The id of the user"),
    firstName: z.string().describe("The first name of the user"),
    lastName: z.string().describe("The last name of the user"),
    email: z.string().describe("The email of the user"),
    phone: z.string().optional().describe("The phone number of the user"),
  }),
  threadId: z.string().describe("The thread id of the conversation"),
});

type BookingParams = z.infer<typeof bookingCallSchema>;

const getUserToken = async (userId: string): Promise<string | null> => {
  try {
    const db = getDatabase();
    const tokensCollection = db.collection("access_tokens");
    const document = await tokensCollection.findOne({ userId: userId });
    return document?.token || null;
  } catch (error) {
    console.error("Error getting user token", error);
    return null;
  }
};

const makeBookingCall = async (params: BookingParams) => {
  const userToken = await getUserToken(params.user.id);
  const mode = await getCallMode(params.threadId);

  if (!userToken) {
    console.error("Not authorized to make calls");
    throw new Error("Not authorized to make calls");
  }

  const phoneNumberToCall =
    mode === "test" ? params.user.phone : params.phoneNumber;

  console.log(
    `Making booking call for user ${params.user.firstName} to restaurant ${params.restaurantName} on ${params.date} at ${params.time}`
  );
  console.log("Phone number to call:", phoneNumberToCall);
  console.log(
    "Phone number in the environment:",
    environment.DEFAULT_PHONE_NUMBER_TO_CALL
  );

  const data = {
    phone_number: phoneNumberToCall,
    from: environment.BLIP_CALLER_PHONE_NUMBER,
    encrypted_key: environment.BLIP_ENCRYPTED_KEY,
    task:
      "You are Clair from Fluid AI Concierge desk, you initiate calls to restaurants to make and manage reservations on behalf of your Client_Name.\n" +
      "\n Goal: Call Restaurant to place a reservation only and exclusively according to your Client_Name requested Reservation Date. Do not proceed with any date & time that do not fit the Client_Name's request.\n" +
      "\n Restaurant you are calling: Restaurant Name" +
      "\n Reservation Date: Reservation Date" +
      "\n Reservation time: Preferred_Time" +
      //  "\n Other Acceptable Time Range: Alternative Reservation Time Range" +
      "\n Reservation Notes: Seating Preferences" +
      "\n Client Name: Client_FirstName Client_LastName" +
      "\n Client Phone number: Client_Number" +
      "\n Call Flow:" +
      "\n 1- Introduce yourself as Clair from Fluid AI Concierge desk, stating that you're calling on behalf of your client (Client_Name)" +
      "\n 2- Ask if there is availability on the date (Reservation Date) at Time (Preferred_Time)." +
      "\n 3- Provide the number of guests (Party_Size) if asked." +
      //"\n 4- EXCLUSIVELY ONLY If the requested time is unavailable, check if one of the alternative times (Alternative Reservation Time Range) is available." +
      "\n 5- If the user has mentioned a seating preference (Seating Preferences), mention it to the restaurant operator." +
      "\n 6- Once a suitable time is found, provide any required information Only and only when asked: Client_FirstName Client_LastName; Client_Number; Client_Email." +
      "\n 7- If no suitable time is found thank the operator and end the call.\n" +
      "\n Key Instructions:" +
      "\n- Keep all your responses polite and short to the point and simple. Use casual language." +
      "\n- You should take a passive approach and let the operator take the lead in the conversation." +
      "\n- This is a voice conversation, so keep your responses short, like in a real conversation. Don't ramble for too long.\n" +
      "\n Pronunciation Guide:" +
      "\n When you spell the client email address you must speak very slowly for each alphabetical characters and clearly with long time." +
      '\n - Exclusively only If asked to spell the First Name or last Name you should use the phonetic alphabet, example: "Karim" should be said as: "Karim spelled as: Kilo; Alpha; Romeo; India; Mike" & Nassereddine Should be said as " Nassereddine Spelled as: November; Alpha; Sierra; Sierra; Echo; Romeo; Echo; Delta; Delta; India; November; Echo ).' +
      '\n - Exclusively only If asked to spell the email you should use the phonetic alphabet for the first part of the email, example: "Karim.nassereddine@gmail.com" should be said as: "email spelled as: Kilo; Alpha; Romeo; India; Mike; Dot; November; Alpha; Sierra; Sierra; Echo; Romeo; Echo; Delta; Delta; India; November; Echo; at; GMail; Dot; com)' +
      '\n - To pronounce the phone number you should always speak very slowly for each number and you should add semi-comas between each number example" 0505958464" should be said as: "Zero; Five; Zero; Five; Nine; Five; Eight; Four; Six; Four".\n\n ',
    model: "enhanced",
    language: "en", // TODO: get language from phone number
    voice: "maya",
    voice_settings: {},
    local_dialing: false,
    max_duration: 12,
    answered_by_enabled: true,
    amd: true,
    wait_for_greeting: true,
    record: true,
    background_track: "office", // TODO: Check if this is correct
    interruption_threshold: 200,
    temperature: 0.6,
    transfer_list: {},
    metadata: { "": "" },
    pronunciation_guide: [
      {
        word: "0505958464",
        pronunciation:
          "Zero . Five .. Zero . Five .. Nine . Five .. Eight . Four .. Six . Four",
        case_sensitive: false,
        spaced: false,
      },
    ],
    keywords: ["example@email.com:3", "123-456-7890:3"],
    start_time: null,
    request_data: {
      "Restaurant Name": params.restaurantName,
      Client_Name: `${params.user.firstName} ${params.user.lastName}`,
      Client_Email: params.user.email,
      Client_Number: params.user.phone,
      "Reservation Date": params.date,
      Preferred_Time: params.time,
      //  "Alternative Reservation Time Range": `${moment(
      //    state.alternative_times.start,
      //    "HH:mm"
      //  ).format("h:mm A")} - ${moment(
      //    state.alternative_times.end,
      //    "HH:mm"
      //  ).format("h:mm A")}`,
      "Seating Preferences":
        params.seatingPreferences || "No specific preferences",
      Party_Size: `${params.numberOfPeople} Guests`,
    },
    webhook: `https://ai-container-app.redsky-e0008d3b.uaenorth.azurecontainerapps.io/api/v1/bland-ai-webhook?token=${encodeURIComponent(
      userToken
    )}`,
  };

  try {
    const response = await fetch(`${environment.BLIP_API_URL}/v1/calls`, {
      method: "POST",
      headers: {
        Authorization: `${environment.BLIP_API_KEY}`,
        "Content-Type": "application/json", // 🔴 Required for JSON body
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    const database = getDatabase();
    const collection = database.collection("bland_logs");

    await collection.insertOne({
      callID: responseData.call_id,
      chatID: "",
      messageRef: "",
      restaurant_details: {},
      date: params.date,
      status: "pending",
      created_at: new Date(),
      treated: false,
      ended: false,
    });

    return responseData;
  } catch (error) {
    console.error("Error generating call:", error);
    throw error;
  }
};

const getCallStatusSchema = z.object({
  userId: z.string().describe("The id of the user"),
  callId: z.string().describe("The id of the call"),
});

type GetCallStatusParams = z.infer<typeof getCallStatusSchema>;

const getCallStatus = async ({ userId, callId }: GetCallStatusParams) => {
  const userToken = await getUserToken(userId);
  if (!userToken) {
    throw new Error("Not authorized to make calls");
  }
  try {
    const response = await fetch(
      `${environment.AI_SERVICE_API}/reservation-status/${callId}`,
      {
        method: "GET",
        headers: {
          token: `${userToken}`,
        },
      }
    );
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error("Error getting call status:", error);
    throw error;
  }
};

const makeBookingCallTool = tool(
  async (params: BookingParams) => {
    try {
      const response = await makeBookingCall(params);
      console.log("Response from makeBookingCall:", response);
      return JSON.stringify(response, null, 2);
    } catch (error) {
      console.error("Error generating call:", error);
      return JSON.stringify({
        content: `Error generating call: ${JSON.stringify(error, null, 2)}`,
      });
    }
  },
  {
    name: "makeBookingCall",
    description: "Make a booking call to a restaurant",
    schema: bookingCallSchema,
  }
);

const getCallStatusTool = tool(
  async (params: GetCallStatusParams) => {
    try {
      const response = await getCallStatus(params);
      return JSON.stringify(response, null, 2);
    } catch (error) {
      return JSON.stringify({
        content: `Error getting call status: ${JSON.stringify(error, null, 2)}`,
      });
    }
  },
  {
    name: "getCallStatus",
    description: "Get the status of a call",
    schema: getCallStatusSchema,
  }
);

export { makeBookingCallTool, getCallStatusTool };

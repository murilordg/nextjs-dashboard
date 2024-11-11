import { getPusherInstance } from "@/lib/pusher/server";

const pusherServer = getPusherInstance();

export async function POST(req: Request) {
    const data = await req.text();
    const [socketId, channelName] = data
        .split("&")
        .map((str) => str.split("=")[1]);

    // logic to check user permissions

    const authResponse = pusherServer.authorizeChannel(socketId, channelName);

    return new Response(JSON.stringify(authResponse));
}
import { providers } from "@/data/providers";



export async function POST(req: Request) {

  const body = await req.json();



  const service = body.service?.toLowerCase() || "";

  const location = body.location?.toLowerCase() || "";



  const match = providers.find(

    (p) =>

      p.category.toLowerCase().includes(service) &&

      p.location.toLowerCase().includes(location)

  );



  if (!match) {

    return Response.json({ providerFound: false });

  }



  return Response.json({ providerFound: true, provider: match });

}


import { newUrl } from "@/lib/util";
import { ApiRes, OauthRes, GetPoem, GetPoemRes, OauthError } from "@/lib/types";
import { NextApiRequest, NextApiResponse } from "next";

let ACCESS_TOKEN: undefined | OauthError | OauthRes;
async function getAccessToken(): Promise<OauthError | OauthRes> {
  if (ACCESS_TOKEN == undefined) {
    const url = newUrl("https://aip.baidubce.com/oauth/2.0/token", {
      client_id: process.env.API_KEY,
      client_secret: process.env.SECRET_KEY,
      grant_type: "client_credentials",
    });
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
    });
    ACCESS_TOKEN = (await response.json()) as OauthError | OauthRes;
  }
  return ACCESS_TOKEN;
}

async function getPoem(params: GetPoem): Promise<ApiRes<GetPoemRes>> {
  const accessToken = await getAccessToken();
  if ("error" in accessToken) {
    return {
      error_code: 0,
      error_msg: accessToken.error_description,
    };
  }
  const url = newUrl("https://aip.baidubce.com/rpc/2.0/nlp/v1/poem", {
    access_token: accessToken.access_token,
  });
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });
  return response.json();
}

const post = async (params: GetPoem) => {
  return await getPoem(params);
};

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case "POST":
      post(req.body).then((data) => res.status(200).json(data));
  }
};

export default handler;

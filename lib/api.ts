import { ApiRes, GetPoem, GetPoemRes } from "./types";
import { newUrl } from "./util";

export const getPoem = async (params: GetPoem): Promise<ApiRes<GetPoemRes>> => {
  const url = newUrl("/api/poem");
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });
  return await response.json();
};

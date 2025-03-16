import axios from "axios";

const streamKeyParser = async (
  url: string
): Promise<{ streamkey: string; token: string }> => {
  try {
    const split = url.split("/");
    const streamkey = split[split.length - 1];
    if (streamkey == "") {
      throw new Error("Invalid URL");
    }

    const token = await axios.post(
      `https://ws.bagibagi.co/ws/overlay/negotiate?streamkey=${streamkey}&negotiateVersion=1`
    );
    const data = token.data as { connectionToken: string };

    return {
      streamkey: streamkey,
      token: data.connectionToken,
    };
  } catch (error: any) {
    throw new Error(error.message ?? "Invalid URL");
  }
};

export default streamKeyParser;

import queryString from "query-string";

const streamKeyParser = (streamKey: string) => {
  try {
    const url = new URL(streamKey);
    const parsed = queryString.parse(url.search) as {
      streamKey?: string;
    };

    if (!parsed.streamKey) {
      throw new Error("Stream Key not provided!");
    }

    return parsed.streamKey;
  } catch (error: any) {
    throw new Error(error.message ?? "Invalid URL");
  }
};

export default streamKeyParser;

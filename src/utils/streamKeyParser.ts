import queryString from "query-string";

const streamKeyParser = (streamKey: string) => {
  try {
    const url = new URL(streamKey);
    const parsed = queryString.parse(url.search) as {
      streamKey: string;
    };

    return parsed.streamKey;
  } catch (error) {
    throw new Error("Invalid URL");
  }
};

export default streamKeyParser;

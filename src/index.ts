declare global {
  interface Array<T> {
    findLastIndex(
      predicate: (value: T, index: number, obj: T[]) => unknown,
      thisArg?: any
    ): number;
  }
}

export default function generateNextAlphaNumString({
  previous_id,
  ...args
}: {
  previous_id: string;
  alpha?: string;
  length?: { num?: number; alpha?: number };
}) {
  let currentAlpha: string;
  const id = previous_id?.split("");
  let currentNum = "0".repeat(args?.length?.num || 4);
  if (previous_id != null) {
    currentNum = (previous_id as any)?.match(/\d+/g)[0];
  }

  if (!args.alpha) {
    currentAlpha =
      id
        ?.slice(0, args.length?.alpha || 2)
        ?.join("")
        ?.toUpperCase() || "A".repeat(args?.length?.alpha || 2);
  } else {
    currentAlpha = args.alpha;
  }

  // Increment the numeric part
  let nextNum = +currentNum + 1;
  const MaxLengthOfCurrentSeries = "9".repeat(currentNum?.length); //it will return max number of current length eg. if length=4=>return 9999

  if (nextNum > +MaxLengthOfCurrentSeries) {
    // If the numeric part exceeds 9999, reset it to 0000
    if (currentAlpha == "Z".repeat(currentAlpha?.length)) {
      nextNum = "0".repeat(currentNum?.length + 1) as unknown as number;
      currentAlpha = "A".repeat(args?.length?.alpha || 2);
    } else {
      nextNum = +"0".repeat(currentNum?.length);
      // Increment the alpha part
      const CharCodes = Array.from({ length: currentAlpha?.length }, (_, i) =>
        currentAlpha?.charCodeAt(i)
      ) as number[];
      //if every charecter is 'Z' then set all to AA and increase the length by 1
      // const FirstIndexOfNoNZ = CharCodes.indexOf("Z".charCodeAt(0));
      const lastIndexOfNonZ = CharCodes.findLastIndex(
        (code) => code != "Z".charCodeAt(0)
      );
      if (CharCodes[CharCodes.length - 1] !== "Z".charCodeAt(0)) {
        //if last charecter is not z then increase last charecter only----
        CharCodes[CharCodes.length - 1] =
          (CharCodes[CharCodes?.length - 1] as number) + 1;
      } else if (CharCodes[lastIndexOfNonZ]) {
        CharCodes[lastIndexOfNonZ] = (CharCodes[lastIndexOfNonZ] as number) + 1; //increase last non z charecter
        //set all charecter to A after non zero charecter
        for (let i = lastIndexOfNonZ + 1; i < CharCodes?.length; i++) {
          CharCodes[i] = "A".charCodeAt(0);
        }
      }

      currentAlpha = String.fromCharCode(...CharCodes);
    }
  }
  // Format the numeric part with leading zeros and return the result
  const formattedNum = String(nextNum).padStart(
    args?.length?.num || nextNum.toString().length,
    "0"
  );
  return `${currentAlpha}${formattedNum}`;
}

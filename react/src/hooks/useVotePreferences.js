import { atomWithStorage } from "jotai/utils";
import { useAtom } from "jotai/react";

const initialState = {
  skipVoted: true,
  onSubmitted: "continue",
  onEnded: "pause"
};
const preferencesAtom = atomWithStorage("votePreferences", initialState);

const useVotePreferences = () => useAtom(preferencesAtom);

export default useVotePreferences;

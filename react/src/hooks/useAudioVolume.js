import { useAtom, atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

const normalizeVolume = (volume) => Math.min(1, Math.max(0.0, volume));

const _volumeAtom = atomWithStorage("audioVolume", 1.0);
const volumeAtom = atom(
  (get) => normalizeVolume(get(_volumeAtom)),
  (_, set, volume) => set(_volumeAtom, normalizeVolume(volume))
);

const useAudioVolume = () => useAtom(volumeAtom);

export default useAudioVolume;

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Song, BoardSize } from "@/types/song";

interface GameState {
  // Per-playlist state
  boards: Record<string, Song[]>; // playlistId -> board
  boardSizes: Record<string, BoardSize>; // playlistId -> board size
  checkedSongs: Record<string, Set<string>>; // playlistId -> Set of song identifiers

  // Global state
  showList: boolean;
  currentTab: string;

  // Actions
  setBoardSize: (playlistId: string, size: BoardSize) => void;
  setShowList: (show: boolean) => void;
  setCurrentTab: (tab: string) => void;
  generateBoard: (playlistId: string, songs: Song[], size: BoardSize) => void;
  toggleSongCheck: (playlistId: string, songId: string) => void;
  isSongChecked: (playlistId: string, songId: string) => boolean;
  resetGame: (playlistId?: string) => void;
  getBoardSize: (playlistId: string) => BoardSize;
  getCurrentBoard: (playlistId: string) => Song[];
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      boards: {},
      boardSizes: {},
      showList: false,
      currentTab: "board",
      checkedSongs: {},
      setBoardSize: (playlistId, size) => {
        const { boardSizes } = get();
        set({ boardSizes: { ...boardSizes, [playlistId]: size } });
      },
      setShowList: (show) => set({ showList: show }),
      setCurrentTab: (tab) => set({ currentTab: tab }),
      generateBoard: (playlistId, songs, size) => {
        const requiredSongs = size * size;
        const randomSongs = [...songs]
          .sort(() => 0.5 - Math.random())
          .slice(0, requiredSongs);
        const { boards } = get();
        set({ boards: { ...boards, [playlistId]: randomSongs } });
      },
      getBoardSize: (playlistId) => {
        const { boardSizes } = get();
        return boardSizes[playlistId] || 4;
      },
      getCurrentBoard: (playlistId) => {
        const { boards } = get();
        return boards[playlistId] || [];
      },
      toggleSongCheck: (playlistId, songId) => {
        const { checkedSongs } = get();
        const playlistChecked = checkedSongs[playlistId] || new Set<string>();

        if (playlistChecked.has(songId)) {
          playlistChecked.delete(songId);
        } else {
          playlistChecked.add(songId);
        }

        set({
          checkedSongs: {
            ...checkedSongs,
            [playlistId]: playlistChecked,
          },
        });
      },
      isSongChecked: (playlistId, songId) => {
        const { checkedSongs } = get();
        return checkedSongs[playlistId]?.has(songId) || false;
      },
      resetGame: (playlistId) => {
        if (playlistId) {
          // Only reset checked songs for the current playlist
          // Board size and current board are preserved
          const { checkedSongs } = get();
          const updatedCheckedSongs = { ...checkedSongs };
          delete updatedCheckedSongs[playlistId];

          set({
            checkedSongs: updatedCheckedSongs,
          });
        } else {
          // Reset all checked songs across all playlists
          set({
            checkedSongs: {},
          });
        }
      },
    }),
    {
      name: "music-bingo-game",
      storage: createJSONStorage(() => localStorage),
      // Custom serialization for Set objects
      partialize: (state) => ({
        boards: state.boards,
        boardSizes: state.boardSizes,
        showList: state.showList,
        currentTab: state.currentTab,
        checkedSongs: Object.fromEntries(
          Object.entries(state.checkedSongs).map(([key, value]) => [
            key,
            Array.from(value),
          ])
        ),
      }),
      // Custom deserialization for Set objects
      merge: (persistedState: unknown, currentState: GameState) => {
        const persisted = persistedState as Partial<GameState> & {
          checkedSongs?: Record<string, string[]>;
        };

        return {
          ...currentState,
          ...persisted,
          checkedSongs: Object.fromEntries(
            Object.entries(persisted?.checkedSongs || {}).map(
              ([key, value]) => [key, new Set(value)]
            )
          ),
        };
      },
    }
  )
);

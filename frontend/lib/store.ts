import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  username?: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  updateUser: (updates: Partial<User>) => void;
  logout: () => void;
  isTokenExpired: () => boolean;
  getValidToken: () => Promise<string | null>;
}

// Helper to decode JWT and check expiration
function isJwtExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    // Add 30 seconds buffer before actual expiration
    return payload.exp * 1000 < Date.now() + 30000;
  } catch {
    return true;
  }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      setAuth: (user, accessToken, refreshToken) =>
        set({ user, accessToken, refreshToken }),
      setTokens: (accessToken, refreshToken) =>
        set({ accessToken, refreshToken }),
      updateUser: (updates) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, ...updates } });
        }
      },
      logout: () => set({ user: null, accessToken: null, refreshToken: null }),
      isTokenExpired: () => {
        const { accessToken } = get();
        if (!accessToken) return true;
        return isJwtExpired(accessToken);
      },
      getValidToken: async () => {
        const { accessToken, refreshToken, user, setTokens, logout } = get();

        if (!accessToken || !refreshToken || !user) {
          return null;
        }

        // If token is still valid, return it
        if (!isJwtExpired(accessToken)) {
          return accessToken;
        }

        // Token expired, try to refresh
        try {
          const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
          const response = await fetch(`${API_URL}/api/auth/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken, userId: user.id }),
          });

          if (!response.ok) {
            logout();
            return null;
          }

          const data = await response.json();
          setTokens(data.accessToken, data.refreshToken);
          return data.accessToken;
        } catch {
          logout();
          return null;
        }
      },
    }),
    {
      name: "auth-storage",
      skipHydration: true,
    }
  )
);

// Editor state
export interface Block {
  id: string;
  type: string;
  props: Record<string, unknown>;
}

// Page settings interface
export interface PageSettings {
  title: string;
  description: string;
  slug: string;
  coverImage: string;
  ogImage: string;
  favicon: string;
  customCss: string;
  customJs: string;
  noIndex: boolean;
  canonicalUrl: string;
  layout: "contained" | "full";
}

// Theme settings interface
export interface ThemeSettings {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  headingFontFamily: string;
  baseFontSize: number;
  borderRadius: "none" | "sm" | "md" | "lg" | "xl";
  containerWidth: "narrow" | "normal" | "wide" | "full";
}

// Custom template interface
export interface CustomTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail?: string;
  blocks: Block[];
  createdAt: string;
}

// Version history interface
export interface PageVersion {
  id: string;
  blocks: Block[];
  createdAt: string;
  label?: string;
}

const defaultPageSettings: PageSettings = {
  title: "",
  description: "",
  slug: "",
  coverImage: "",
  ogImage: "",
  favicon: "",
  customCss: "",
  customJs: "",
  noIndex: false,
  canonicalUrl: "",
  layout: "contained",
};

const defaultThemeSettings: ThemeSettings = {
  primaryColor: "#6366f1",
  secondaryColor: "#f59e0b",
  backgroundColor: "#ffffff",
  textColor: "#1f2937",
  fontFamily: "Inter, sans-serif",
  headingFontFamily: "Inter, sans-serif",
  baseFontSize: 16,
  borderRadius: "md",
  containerWidth: "normal",
};

export type PreviewMode = "desktop" | "tablet" | "mobile";

interface EditorState {
  blocks: Block[];
  selectedBlockId: string | null;
  history: Block[][];
  historyIndex: number;
  clipboard: Block | null;
  hiddenBlockIds: string[];
  pageSettings: PageSettings;
  themeSettings: ThemeSettings;
  customTemplates: CustomTemplate[];
  versions: PageVersion[];
  previewMode: PreviewMode;
  setBlocks: (blocks: Block[]) => void;
  addBlock: (block: Block, index?: number) => void;
  updateBlock: (id: string, props: Record<string, unknown>) => void;
  removeBlock: (id: string) => void;
  moveBlock: (fromIndex: number, toIndex: number) => void;
  selectBlock: (id: string | null) => void;
  duplicateBlock: (id: string) => void;
  copyBlock: (id: string) => void;
  pasteBlock: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  toggleBlockVisibility: (id: string) => void;
  isBlockVisible: (id: string) => boolean;
  updatePageSettings: (settings: Partial<PageSettings>) => void;
  updateThemeSettings: (settings: Partial<ThemeSettings>) => void;
  saveAsTemplate: (name: string, description: string) => void;
  deleteTemplate: (id: string) => void;
  saveVersion: (label?: string) => void;
  restoreVersion: (id: string) => void;
  deleteVersion: (id: string) => void;
  setPreviewMode: (mode: PreviewMode) => void;
}

// Generate a simple unique ID
function generateId(): string {
  return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
}

export const useEditorStore = create<EditorState>()(
  persist(
    (set, get) => ({
      blocks: [],
      selectedBlockId: null,
      history: [[]],
      historyIndex: 0,
      clipboard: null,
      hiddenBlockIds: [],
      pageSettings: defaultPageSettings,
      themeSettings: defaultThemeSettings,
      customTemplates: [],
      versions: [],
      previewMode: "desktop" as PreviewMode,

      setBlocks: (blocks) => {
        set({
          blocks,
          history: [blocks],
          historyIndex: 0,
        });
      },

      addBlock: (block, index) => {
        const { blocks, history, historyIndex } = get();
        const newBlocks =
          index !== undefined
            ? [...blocks.slice(0, index), block, ...blocks.slice(index)]
            : [...blocks, block];

        const newHistory = [...history.slice(0, historyIndex + 1), newBlocks];
        set({
          blocks: newBlocks,
          history: newHistory,
          historyIndex: newHistory.length - 1,
        });
      },

      updateBlock: (id, props) => {
        const { blocks, history, historyIndex } = get();
        const newBlocks = blocks.map((b) =>
          b.id === id ? { ...b, props: { ...b.props, ...props } } : b
        );

        const newHistory = [...history.slice(0, historyIndex + 1), newBlocks];
        set({
          blocks: newBlocks,
          history: newHistory,
          historyIndex: newHistory.length - 1,
        });
      },

      removeBlock: (id) => {
        const { blocks, history, historyIndex, selectedBlockId, hiddenBlockIds } = get();
        const newBlocks = blocks.filter((b) => b.id !== id);

        const newHistory = [...history.slice(0, historyIndex + 1), newBlocks];
        set({
          blocks: newBlocks,
          history: newHistory,
          historyIndex: newHistory.length - 1,
          selectedBlockId: selectedBlockId === id ? null : selectedBlockId,
          hiddenBlockIds: hiddenBlockIds.filter((hid) => hid !== id),
        });
      },

      moveBlock: (fromIndex, toIndex) => {
        const { blocks, history, historyIndex } = get();
        const newBlocks = [...blocks];
        const [removed] = newBlocks.splice(fromIndex, 1);
        newBlocks.splice(toIndex, 0, removed);

        const newHistory = [...history.slice(0, historyIndex + 1), newBlocks];
        set({
          blocks: newBlocks,
          history: newHistory,
          historyIndex: newHistory.length - 1,
        });
      },

      selectBlock: (id) => set({ selectedBlockId: id }),

      duplicateBlock: (id) => {
        const { blocks, history, historyIndex } = get();
        const blockIndex = blocks.findIndex((b) => b.id === id);
        if (blockIndex === -1) return;

        const block = blocks[blockIndex];
        const duplicatedBlock: Block = {
          id: generateId(),
          type: block.type,
          props: { ...block.props },
        };

        const newBlocks = [
          ...blocks.slice(0, blockIndex + 1),
          duplicatedBlock,
          ...blocks.slice(blockIndex + 1),
        ];

        const newHistory = [...history.slice(0, historyIndex + 1), newBlocks];
        set({
          blocks: newBlocks,
          history: newHistory,
          historyIndex: newHistory.length - 1,
          selectedBlockId: duplicatedBlock.id,
        });
      },

      copyBlock: (id) => {
        const { blocks } = get();
        const block = blocks.find((b) => b.id === id);
        if (!block) return;

        set({ clipboard: { ...block } });
      },

      pasteBlock: () => {
        const { clipboard, blocks, history, historyIndex, selectedBlockId } = get();
        if (!clipboard) return;

        const pastedBlock: Block = {
          id: generateId(),
          type: clipboard.type,
          props: { ...clipboard.props },
        };

        // Insert after selected block or at the end
        const selectedIndex = selectedBlockId
          ? blocks.findIndex((b) => b.id === selectedBlockId)
          : blocks.length - 1;

        const insertIndex = selectedIndex === -1 ? blocks.length : selectedIndex + 1;

        const newBlocks = [
          ...blocks.slice(0, insertIndex),
          pastedBlock,
          ...blocks.slice(insertIndex),
        ];

        const newHistory = [...history.slice(0, historyIndex + 1), newBlocks];
        set({
          blocks: newBlocks,
          history: newHistory,
          historyIndex: newHistory.length - 1,
          selectedBlockId: pastedBlock.id,
        });
      },

      undo: () => {
        const { historyIndex, history } = get();
        if (historyIndex > 0) {
          set({
            blocks: history[historyIndex - 1],
            historyIndex: historyIndex - 1,
          });
        }
      },

      redo: () => {
        const { historyIndex, history } = get();
        if (historyIndex < history.length - 1) {
          set({
            blocks: history[historyIndex + 1],
            historyIndex: historyIndex + 1,
          });
        }
      },

      canUndo: () => get().historyIndex > 0,
      canRedo: () => get().historyIndex < get().history.length - 1,

      toggleBlockVisibility: (id) => {
        const { hiddenBlockIds } = get();
        if (hiddenBlockIds.includes(id)) {
          set({ hiddenBlockIds: hiddenBlockIds.filter((hid) => hid !== id) });
        } else {
          set({ hiddenBlockIds: [...hiddenBlockIds, id] });
        }
      },

      isBlockVisible: (id) => {
        const { hiddenBlockIds } = get();
        return !hiddenBlockIds.includes(id);
      },

      updatePageSettings: (settings) => {
        const { pageSettings } = get();
        set({ pageSettings: { ...pageSettings, ...settings } });
      },

      updateThemeSettings: (settings) => {
        const { themeSettings } = get();
        set({ themeSettings: { ...themeSettings, ...settings } });
      },

      saveAsTemplate: (name, description) => {
        const { blocks, customTemplates } = get();
        const newTemplate: CustomTemplate = {
          id: generateId(),
          name,
          description,
          blocks: blocks.map((b) => ({ ...b, id: generateId() })),
          createdAt: new Date().toISOString(),
        };
        set({ customTemplates: [...customTemplates, newTemplate] });
      },

      deleteTemplate: (id) => {
        const { customTemplates } = get();
        set({ customTemplates: customTemplates.filter((t) => t.id !== id) });
      },

      saveVersion: (label) => {
        const { blocks, versions } = get();
        const newVersion: PageVersion = {
          id: generateId(),
          blocks: blocks.map((b) => ({ ...b })),
          createdAt: new Date().toISOString(),
          label,
        };
        // Keep only last 20 versions
        const newVersions = [...versions, newVersion].slice(-20);
        set({ versions: newVersions });
      },

      restoreVersion: (id) => {
        const { versions, history, historyIndex } = get();
        const version = versions.find((v) => v.id === id);
        if (!version) return;

        const restoredBlocks = version.blocks.map((b) => ({ ...b, id: generateId() }));
        const newHistory = [...history.slice(0, historyIndex + 1), restoredBlocks];
        set({
          blocks: restoredBlocks,
          history: newHistory,
          historyIndex: newHistory.length - 1,
        });
      },

      deleteVersion: (id) => {
        const { versions } = get();
        set({ versions: versions.filter((v) => v.id !== id) });
      },

      setPreviewMode: (mode) => {
        set({ previewMode: mode });
      },
    }),
    {
      name: "editor-storage",
      skipHydration: true,
      partialize: (state) => ({
        customTemplates: state.customTemplates,
        themeSettings: state.themeSettings,
      }),
    }
  )
);

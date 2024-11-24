declare module "react-native-spritesheet" {
  import { Component } from "react";

  interface SpriteSheetProps {
    source: any;
    columns: number;
    rows: number;
    width: number;
    onLoad?: () => void;
    onError?: (error: Error) => void;
  }

  export default class SpriteSheet extends Component<SpriteSheetProps> {
    play(options: {
      from: number;
      to: number;
      loop: boolean;
      fps: number;
    }): void;
    reset(): void;
  }
}

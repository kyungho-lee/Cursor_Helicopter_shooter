export class InputManager {
  private static instance: InputManager;
  private keys: Record<string, boolean> = {};
  private keyActions: Map<string, () => void> = new Map();
  private continuousActions: Map<string, (deltaTime: number) => void> = new Map();

  private constructor() {
    this.initializeKeyListeners();
    this.setupDefaultKeyBindings();
  }

  public static getInstance(): InputManager {
    if (!InputManager.instance) {
      InputManager.instance = new InputManager();
    }
    return InputManager.instance;
  }

  private initializeKeyListeners(): void {
    document.addEventListener('keydown', (e) => {
      this.keys[e.key] = true;
      const action = this.keyActions.get(e.key);
      if (action) action();
      // 기본 동작 방지 (예: 스페이스바 스크롤)
      if (e.key === ' ') e.preventDefault();
    });

    document.addEventListener('keyup', (e) => {
      this.keys[e.key] = false;
    });

    // 브라우저 창이 비활성화될 때 모든 키 상태 초기화
    window.addEventListener('blur', () => {
      this.keys = {};
    });
  }

  private setupDefaultKeyBindings(): void {
    // 기본 키 바인딩 설정
    this.keyActions.set(' ', () => {}); // 슈팅
    this.keyActions.set('Control', () => {}); // 미사일
  }

  public isKeyPressed(key: string): boolean {
    return !!this.keys[key];
  }

  public bindKey(key: string, action: () => void): void {
    this.keyActions.set(key, action);
  }

  public bindContinuousAction(key: string, action: (deltaTime: number) => void): void {
    this.continuousActions.set(key, action);
  }

  public update(deltaTime: number): void {
    // 지속적인 키 입력 처리
    this.continuousActions.forEach((action, key) => {
      if (this.isKeyPressed(key)) {
        action(deltaTime);
      }
    });
  }

  public getKeys(): Record<string, boolean> {
    return { ...this.keys };
  }

  // 키 바인딩 초기화
  public clearBindings(): void {
    this.keyActions.clear();
    this.continuousActions.clear();
    this.setupDefaultKeyBindings();
  }
} 
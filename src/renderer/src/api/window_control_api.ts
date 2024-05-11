export class window_control_api {
  public static set_frameless(): void {
    // @ts-ignore
    window.win.set_frameless()
  }

  public static show_notification(title: string, body: string): void {
    // @ts-ignore
    window.win.show_notification(title, body)
  }

  public static set_fullscreen(): void {
    // @ts-ignore
    window.win.fullscreen(true)
  }

  public static set_miminize(): void {
    // @ts-ignore
    window.win.miminize(true)
  }

  public static set_maximize(): void {
    // @ts-ignore
    window.win.maximize(true)
  }

  public static set_close(): void {
    // @ts-ignore
    window.win.close(true)
  }

  public static exit_maximize(): void {
    // @ts-ignore
    window.win.unmaximize(true)
  }

  public static async set_window_size(width: number, height: number): Promise<void> {
    // @ts-ignore
    // await win.set_window_size(width, height)
    return new Promise<void>((resolve, reject) => {
      // @ts-ignore
      window.win
        .set_window_size(width, height)
        .then(() => {
          resolve()
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  public static async set_resizable(set: boolean): Promise<void> {
    // @ts-ignore
    // await win.set_resizable(set)
    return new Promise<void>((resolve, reject) => {
      // @ts-ignore
      window.win
        .set_resizable(set)
        .then(() => {
          resolve()
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  public static async get_window_size(): Promise<number[]> {
    // @ts-ignore
    // return win.get_window_size()
    return new Promise<number[]>((resolve, reject) => {
      // @ts-ignore
      window.win
        .get_window_size()
        .then((size: number[]) => {
          resolve(size)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }
}

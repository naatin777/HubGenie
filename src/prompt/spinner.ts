export class Spinner {
  private frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
  private interval = 50;
  private timer?: number;
  private idx = 0;
  private message = "";

  constructor(message = "") {
    this.message = message;
    Deno.addSignalListener("SIGINT", () => {
      this.stop();
      Deno.exit(1);
    });
  }

  start(message?: string) {
    if (message !== undefined) this.message = message;
    this.render();
    this.timer = setInterval(() => this.render(), this.interval);
  }

  stop(finalMessage?: string) {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = undefined;
    }
    this.clearLine();
    if (finalMessage) {
      Deno.stdout.writeSync(new TextEncoder().encode(finalMessage + "\n"));
    }
  }

  setMessage(msg: string) {
    this.message = msg;
  }

  private render() {
    const frame = this.frames[this.idx % this.frames.length];
    this.idx++;
    const text = `${frame} ${this.message}`;
    this.clearLine();
    Deno.stdout.writeSync(new TextEncoder().encode(text));
  }

  private clearLine() {
    Deno.stdout.writeSync(new TextEncoder().encode("\r\x1b[K"));
  }
}

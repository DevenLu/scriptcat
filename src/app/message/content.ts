import { Channel } from "./channel";
import {
  ChannelManager,
  MessageHander,
  MessageManager,
  WarpChannelManager,
} from "./message";

// content与页面通讯,使用CustomEvent
export default class MessageContent
  extends MessageHander
  implements MessageManager
{
  static instance: MessageContent;

  static getInstance() {
    return this.instance;
  }

  eventId: string;

  isContent: boolean;

  channelManager: ChannelManager;

  constructor(eventId: string, isContent: boolean) {
    super();
    this.eventId = eventId;
    this.isContent = isContent;
    this.channelManager = new WarpChannelManager((data) => {
      this.nativeSend(data);
    });
    document.addEventListener(
      (isContent ? "ct" : "fd") + eventId,
      (event: unknown) => {
        const message = (<
          {
            detail: {
              data: any;
              action: string;
              stream: string;
              error: any;
              connect: boolean;
            };
          }
        >event).detail;
        this.handler(message, this.channelManager, { targetTag: "content" });
      }
    );
    if (!MessageContent.instance) {
      MessageContent.instance = this;
    }
  }

  // 组合ChannelManager

  getChannel(flag: string): Channel | undefined {
    return this.channelManager.getChannel(flag);
  }

  channel(flag?: string): Channel {
    return this.channelManager.channel(flag);
  }

  disChannel(channel: Channel): void {
    return this.channelManager.disChannel(channel);
  }

  free(): void {
    return this.channelManager.free();
  }

  syncSend(action: string, data: any): Promise<any> {
    const channel = this.channelManager.channel();
    return channel.syncSend(action, data);
  }

  nativeSend(data: any): void {
    let detail = data;
    if (typeof cloneInto !== "undefined") {
      try {
        // eslint-disable-next-line no-undef
        detail = cloneInto(detail, document.defaultView);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
      }
    }
    const ev = new CustomEvent((this.isContent ? "fd" : "ct") + this.eventId, {
      detail,
    });
    document.dispatchEvent(ev);
  }

  public send(action: string, data: any) {
    this.nativeSend({
      action,
      data,
    });
  }
}
type State = {
  fart: {
    id: number;
    top: number;
    left: number;
    shownAt: number;
  } | null;
};

const FART_SIZE = 200;
const FART_DURATION = 10000;

const checkPrivileges = (
  data: EKG.ChatSent["data"],
  privileges: string
): boolean => {
  const { isModerator, isBroadcaster, isVip, isSubscriber } = data;
  if (isBroadcaster) return true;
  if (privileges === "justSubs" && isSubscriber) return true;
  if (privileges === "mods" && isModerator) return true;
  if (privileges === "vips" && (isModerator || isVip)) return true;
  if (privileges === "subs" && (isModerator || isVip || isSubscriber))
    return true;
  return privileges === "everybody";
};

EKG.widget("fart")
  .initialState<State>(() => ({
    fart: null,
  }))
  .register((event, state, ctx) => {
    switch (event.type) {
      case "ekg.chat.sent": {
        const { fartCommand, privileges } = ctx.settings;
        const text = EKG.utils.chatToText(event.data.message);
        if (
          !text.startsWith(fartCommand) ||
          !checkPrivileges(event.data, privileges)
        ) {
          return state;
        }
        const top = ctx.random() * (ctx.size.height - FART_SIZE);
        const left = ctx.random() * (ctx.size.width - FART_SIZE);
        return {
          ...state,
          fart: {
            id: (state.fart?.id ?? 0) + 1,
            top,
            left,
            shownAt: ctx.now,
          },
        };
      }
      case "TICK": {
        if (state.fart && ctx.now - state.fart.shownAt > FART_DURATION) {
          return { ...state, fart: null };
        }
        return state;
      }
      default:
        return state;
    }
  });

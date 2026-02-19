type State = {}


const checkPrivileges = (event, privileges) => {
    const {isModerator, isBroadcaster, isVip, isSubscriber} = event;
    if (isBroadcaster) return true;
    if (privileges === "justSubs" && isSubscriber) return true;
    if (privileges === "mods" && isModerator) return true;
    if (privileges === "vips" && (isModerator || isVip)) return true;
    if (privileges === "subs" && (isModerator || isVip || isSubscriber)) return true;
    return privileges === "everybody";
};

const fartSize = 200;
let timeout;

const hide = () => {
    const fart = document.getElementById('fart');
    fart.className = 'fart hidden';
};

const doFart = () => {
    if(timeout){
        clearTimeout(timeout);
        timeout = undefined;
    }
    hide();
    const mainContainer = document.getElementById('main-container');
    const fart = document.getElementById('fart');
    const sound = document.getElementById('sound') as HTMLAudioElement;
    const {height, width} = mainContainer.getBoundingClientRect();
    fart.style.top = `${Math.random() * (height - fartSize)}px`;
    fart.style.left = `${Math.random() * (width - fartSize)}px`;
    fart.className = 'fart';
    sound.play();
    timeout = setTimeout(() => {
        hide();
    }, 10000);
};


const addMessage = (event: EKG.ChatSent, state: State, ctx: EKG.WidgetContext) => {
    const {message} = event;
    const {fartCommand, privileges} = ctx.settings;
    console.log(window.JSON.stringify(ctx));
    console.log(window.JSON.stringify(ctx.settings));
    const textStartsWithCommand = message.startsWith(fartCommand);
    if(!textStartsWithCommand || !checkPrivileges(event, privileges)){
        return;
    }

    doFart();

  return { ...state }
};


EKG.widget('fart')
    .initialState<State>((ctx, initial) => ({}))
    .register((event, state, ctx) => {
        switch (event.type) {
            case 'ekg.chat.sent':
                addMessage(event, state, ctx);
                return state;
        }
        return state
    });
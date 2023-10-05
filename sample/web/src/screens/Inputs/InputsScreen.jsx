import React, {useCallback} from 'react';
import TelegramHeader from "../../components/Header/TelegramHeader";
import TelegramText from "../../components/Text/TelegramText";
import './InputsScreen.css';
import {useTelegram} from "../../hooks/useTelegram";
import TelegramMiniForm from "../../components/MiniForm/TelegramMiniForm";
import TelegramOptionsForm from "../../components/OptionsForm/TelegramOptionsForm";
import TelegramButton from "../../components/Button/TelegramButton";

const InputsScreen = () => {
    const {webApp} = useTelegram()

    const onResult = (functionName, argument, result) => {
        // Show function call result using an alert
        webApp.showAlert(`${functionName}(${argument}) returned result(${result})`)
    }

    // Check this section for more details https://core.telegram.org/bots/webapps#initializing-mini-apps
    const onIsVersionAtLeast = (version) => {
        const result = webApp.isVersionAtLeast(version)
        onResult('isVersionAtLeast', version, result)
    }

    const onSetHeaderColor = (color) => {
        const result = webApp.setHeaderColor(color)
        onResult('setHeaderColor', color, result)
    }

    const onSetBackgroundColor = (color) => {
        const result = webApp.setBackgroundColor(color)
        onResult('setBackgroundColor', color, result)
    }

    let registeredEvent = ''
    // This callback handles clicks on the main button
    const onEvent = useCallback(async (data) => {
        onResult('onEventReceived', registeredEvent, JSON.stringify(data))
    }, [registeredEvent]);

    const onOnEvent = (event) => {
        webApp.offEvent(registeredEvent, onEvent)
        const result = webApp.onEvent(event, onEvent)
        registeredEvent = event
        onResult('onEvent', event, result)
    }

    const onOffEvent = () => {
        const result = webApp.offEvent(registeredEvent, onEvent)
        onResult('offEvent', registeredEvent, result)
    }

    const onSwitchInlineQuery = (query, options) => {
        const result = webApp.switchInlineQuery(query, options)
        onResult('switchInlineQuery', `${query}, ${options}`, result)
    }


    const onSendData = (data) => {
        const result = webApp.sendData(data)
        onResult('sendData', data, result)
    }

    return (
        <div className={'inputsScreen'}>
            <TelegramHeader>
                <TelegramText className={'telegramTitle'}>Inputs Screen</TelegramText>
            </TelegramHeader>

            <TelegramText className={'telegramText'}>The version of the Bot API available in the user's Telegram app: {webApp.version}</TelegramText>

            <TelegramMiniForm
                fieldlabel={'isVersionAtLeast'}
                fielddescription={'Returns true if the user\'s app supports a version of the Bot API that is equal to or higher than the version passed as the parameter'}
                fieldhint={`Bot version, e.g ${webApp.version}`}
                buttonlabel={'Execute'}
                onSubmit={onIsVersionAtLeast}
            />

            <TelegramMiniForm
                fieldlabel={'setHeaderColor'}
                fielddescription={
                    'Bot API 6.1+ A method that sets the app header color in the #RRGGBB format. You can also use keywords bg_color and secondary_bg_color.\n' +
                    '\n' +
                    'Up to Bot API 6.9 You can only pass Telegram.WebApp.themeParams.bg_color or Telegram.WebApp.themeParams.secondary_bg_color as a color or bg_color, secondary_bg_color keywords.'
                }
                fieldhint={`#RRGGBB color, e.g ${webApp.headerColor}`}
                buttonlabel={'Execute'}
                onSubmit={onSetHeaderColor}
            />

            <TelegramMiniForm
                fieldlabel={'setBackgroundColor'}
                fielddescription={
                    'Bot API 6.1+ A method that sets the app background color in the #RRGGBB format. You can also use keywords bg_color and secondary_bg_color.'
                }
                fieldhint={`#RRGGBB color, e.g ${webApp.backgroundColor}`}
                buttonlabel={'Execute'}
                onSubmit={onSetBackgroundColor}
            />

            <TelegramMiniForm
                fieldlabel={'onEvent'}
                fielddescription={
                    'A method that sets the app event handler. Check the list of available events at https://core.telegram.org/bots/webapps#events-available-for-mini-apps'
                }
                fieldhint={`Event key, e.g mainButtonClicked`}
                buttonlabel={'Execute'}
                onSubmit={onOnEvent}
            />

            <TelegramText className={'telegramSubtitle'}>offEvent</TelegramText>
            <TelegramText className={'telegramHint'}>Turn off current registered event listener</TelegramText>
            <TelegramButton onClick={onOffEvent}>Execute</TelegramButton>

            <TelegramMiniForm
                fieldlabel={'sendData'}
                fielddescription={
                    'A method used to send data to the bot. When this method is called, a service message is sent to the bot containing the data data of the length up to 4096 bytes, and the Mini App is closed. See the field web_app_data in the class Message.\n' +
                    '\n' +
                    'This method is only available for Mini Apps launched via a Keyboard button.'
                }
                fieldhint={`Enter some data, e.g /start`}
                buttonlabel={'Execute'}
                onSubmit={onSendData}
            />

            <TelegramOptionsForm
                fieldlabel={'switchInlineQuery'}
                fielddescription={
                    'Bot API 6.7+ A method that inserts the bot\'s username and the specified inline query in the current chat\'s input field. Query may be empty, in which case only the bot\'s username will be inserted. If an optional choose_chat_types parameter was passed, the client prompts the user to choose a specific chat, then opens that chat and inserts the bot\'s username and the specified inline query in the input field. You can specify which types of chats the user will be able to choose from. It can be one or more of the following types: users, bots, groups, channels.'
                }
                fieldhint={`Enter query or command, e.g /start`}
                optionslabel={'choose_chat_types'}
                options={['users', 'bots', 'groups', 'channels']}
                buttonlabel={'Execute'}
                onSubmit={onSwitchInlineQuery}
            />
        </div>
    );
};

export default InputsScreen;

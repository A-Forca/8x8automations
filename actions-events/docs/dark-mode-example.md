# Dark mode example

Here, is a full script example, of where the colours have been configured so it shows in dark mode

```html
    <!-- Place this code snippet anywhere you want the button to appear in your page. If no button has been configured in the chat script, it will not show up nor take any space. -->
    <div id="__8x8-chat-button-container-script_432171646655ddfe1381d46.57361709"></div>

    <!-- This script will not interfere with the button layout, you just need to include it in the same page. It must also be within the <body> section of the page, preferably just before the ending tag. -->
    <script type="text/javascript">
    (function(c, f, ef){
        var typeofC = Object.prototype.toString.call(c);
        var props = (typeofC === '[object Object]' && c) || {};
        var cb = f || (typeofC === '[object Function]' && c);
        var config = {
            scriptUuid: "script_432171646655ddfe1381d46.57361709",
            tenant: "Y2hyaXNjcm9tYmllZGVtbzAx",
            channelName: "QuickRepliesChannel",
            channelUuid: "8aESZCG_Q2ODhI1fcLsV-Q",
            domain: "https://vcc-eu11.8x8.com",
            buttonContainerId: "__8x8-chat-button-container-script_432171646655ddfe1381d46.57361709",
            align: "right",
            themeCustom: {
                "chatBackgroundColor": "#A9A9A9",  
                "chatBorderRadius": "8px",  
                "chatShadow": "12px 8px 20px 0px",  
                "chatTextColor": "#f0f0f0",
                "chatLoaderColor": "#00aaff",  
                "headerBackgroundColor": "#333333",  
                "headerIconColor": "#FFFFFF", 
                "headerIconBackgroundColorHover": "#555555",  
                "headerIconBackgroundColorActive": "#777777",  
                "headerMenuBackgroundColor": "#444444",  
                "headerMenuBorderRadius": "6px",  
                "headerMenuBorderColor": "#666666",  
                "headerMenuBorderWidth": "1px", 
                "headerMenuShadow": "2px 3px 2px 1px",  
                "headerMenuLinkTextColor": "#CCCCCC",  
                "headerMenuLinkTextColorFocus": "#FFFFFF", 
                "headerMenuLinkTextColorHover": "#FFFFFF", 
                "headerMenuLinkBackgroundColor": "#555555",  
                "headerMenuLinkBackgroundColorFocus": "#666666",  
                "headerMenuLinkBackgroundColorHover": "#777777", 
                "headerMenuLinkIconColor": "#BBBBBB",  
            
                "buttonPrimaryTextColor": "#FFFFFF",
                "buttonPrimaryTextColorDisabled": "#888888",
                "buttonPrimaryBackgroundColor": "#333333",
                "buttonPrimaryBackgroundColorHover": "#555555", 
                "buttonPrimaryBackgroundColorActive": "#777777", 
                "buttonPrimaryBackgroundColorDisabled": "#444444", 
                "buttonSecondaryTextColor": "#FFFFFF",  
                "buttonSecondaryTextColorDisabled": "#888888",  
                "buttonSecondaryBackgroundColor": "#575757", 
                "buttonSecondaryBackgroundColorHover": "#777777", 
                "buttonSecondaryBackgroundColorActive": "#999999",  
                "buttonSecondaryBackgroundColorDisabled": "#444444", 
                "buttonBorderRadius": "0px",  
                "messageIncomingBorderRadius": "15px 15px 15px 0", 
                "messageIncomingBackgroundColor": "#2a2a2a", 
                "messageIncomingTextColor": "#e0e0e0", 
                "messageIncomingLinkColor": "#00aaff", 
                "messageIncomingLinkColorHover": "#66ccff",  
                "messageIncomingLinkColorFocus": "#99ddff",  
                "messageIncomingLinkColorVisited": "#aaeeff",  
                "messageOutgoingBorderRadius": "15px 15px 15px 0", 
                "messageOutgoingTextColor": "#ffffff",  
                "messageOutgoingBackgroundColor": "#333333",  
                "messageOutgoingLinkColor": "#00aaff",  
                "messageOutgoingLinkColorHover": "#66ccff",  
                "messageOutgoingLinkColorFocus": "#99ddff",  
                "messageOutgoingLinkColorVisited": "#aaeeff",  
        
                "attachmentItemColor": "#ffffff",  
                "attachmentItemBackgroundColor": "#333333",  
                "attachmentItemBorderRadius": "4px",  
                "attachmentItemBorderColor": "#555555", 
                "attachmentLinkColor": "#00aaff", 
                "attachmentLinkColorHover": "#66ccff",   
                "attachmentLinkColorFocus": "#99ddff",  
                "attachmentIconDownloadColor": "#00aaff",  
                "attachmentIconDownloadColorHover": "#66ccff",  
                "sendMessageBoxSeparator": "#666666",
        
            },

        };

        var url = new URL("https://cloud8-cc-geo.8x8.com/vcc-chat-channels/public/webchat/discovery");
        var params = { domain: config.domain, tenant: config.tenant, channelUuid: config.channelUuid };
        url.search = new URLSearchParams(params).toString();
        fetch(url)
            .then(response => response.json())
            .then(data => config.domain = !data.domain ? config.domain : data.domain)
            .catch(error => console.warn('Failed to retrieve override domain, will continue using ', config.domain, error))
            .finally(() => loadChat());

        function loadChat() {
            var se = document.createElement("script");
            se.type = "text/javascript";
            se.async = true;
            se.src = props.loaderURL || (config.domain + "/CHAT/common/js/chatv3.js");
 
            Object.keys(config).forEach(function (k) { se.dataset[k] = config[k] });
            Object.keys(props).forEach(function (k) { se.dataset[k] = props[k] });
            function handleInitEvent(e) {
                var initFn = e.detail.init;
                initFn(config, cb);
                se.removeEventListener('init', handleInitEvent)
            }
            function handleErrorEvent(e) {
                ef && ef(e);
                se.removeEventListener('customerror', handleErrorEvent);
            }
            se.addEventListener('init', handleInitEvent);
            se.addEventListener('customerror', handleErrorEvent);
            var os = document.getElementsByTagName("script")[0];
            os.parentNode.insertBefore(se, os);
        }
    })();
    </script>
```

# Webchat script

Once you have created the webchat script, when you select the code, it will look like this, which is what will be added to the website for it to work

```html
<!-- Place this code snippet anywhere you want the button to appear in your page. If no button has been configured in the chat script, it will not show up nor take any space. -->
<div id="__8x8-chat-button-container-script_1333070733643e5b8fa7a791.52161248"></div>

<!-- This script will not interfere with the button layout, you just need to include it in the same page. It must also be within the <body> section of the page, preferably just before the ending tag. -->
<script type="text/javascript">
(function(c, f, ef){
    var typeofC = Object.prototype.toString.call(c);
    var props = (typeofC === '[object Object]' && c) || {};
    var cb = f || (typeofC === '[object Function]' && c);
    var config = {
        scriptUuid: "script_1333070733643e5b8fa7a791.52161248",
        tenant: "Y2hyaXNjcm9tYmllZGVtbzAx",
        channelName: "WebChatChannel",
        channelUuid: "Ak3ULjXFQx-unSA6ebdW8A",
        domain: "https://vcc-eu11.8x8.com",
        buttonContainerId: "__8x8-chat-button-container-script_1333070733643e5b8fa7a791.52161248",
        align: "right",
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

<template>
  <div>
    <VCard
      class="mb-6"
      title="Sales"
    >
      <iframe id="redash-iframe-sales" src="http://ptbsp.ddns.net:36502/public/dashboards/twavZa9ft4UYAY4TuIJWTxaMmM8pxqTTjqsAO20W?org_slug=default" width="100%" height="1800px" frameborder="0"></iframe>
    </VCard>
    <VCard
      class="mb-6"
      title="Customer"
    >
      <iframe id="redash-iframe-" src="http://ptbsp.ddns.net:36502/public/dashboards/U9InpuUeKHrMqz58xDqrqXhr13FpToLdYeRUEp8r?org_slug=default" width="100%" height="1800px" frameborder="0"></iframe>
    </VCard>

  </div>
</template>
<script>
    function resizeIframe(iframe) {
        iframe.style.height = iframe.contentWindow.document.body.scrollHeight + 'px';
    }
</script>
<route lang="yaml">
meta:
  subject: Dashboard
  action: read
</route>

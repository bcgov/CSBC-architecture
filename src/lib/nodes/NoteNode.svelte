<script>
  let { data } = $props();
</script>

<!-- Annotations are nodes too. Making them nodes rather than absolutely
     positioned DOM means they pan and zoom with everything else for free. -->
<div class="note">{data.label}</div>

<style>
  .note {
    width: 100%;
    font-size: 15px;
    line-height: 1.45;
    color: #23232b;
    cursor: default;
  }
</style>

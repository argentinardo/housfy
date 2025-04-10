<script lang="ts">
  import RoverUI from './lib/rover/RoverUI.svelte';
  import Alert from './lib/ui/Alert.svelte';
</script>

<main class="min-h-screen flex flex-col items-center justify-center md:p-8 p-0 bg-primary p-4">
  <div class="w-full max-w-6xl">
    <RoverUI />
  </div>
  <Alert />
</main>

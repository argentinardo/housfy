<script lang="ts">
  import type { Direction } from "./types";

  // Props del componente
  export let hasRover: boolean = false;
  export let hasObstacle: boolean = false;
  export let roverDirection: Direction = "N";

  // Mapeo de direcciones a clases CSS (calculado una vez, no reactivamente)
  const directionClasses = {
    N: "direction-n",
    E: "direction-e",
    S: "direction-s",
    O: "direction-w", // 'O' (oeste) en español equivale a 'W' (west) en inglés
  };

  // Clase CSS para el icono del rover (calculada reactivamente)
  $: roverIconClass = hasRover
    ? `rover-icon ${directionClasses[roverDirection] || "direction-n"}`
    : "";
</script>

<div class="cell">
  {#if hasObstacle}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="obstacle"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
      />
    </svg>
  {/if}

  {#if hasRover}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class={roverIconClass}
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M15 11.25l-3-3m0 0l-3 3m3-3v7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  {/if}
</div>

<style>
  .cell {
    aspect-ratio: 1/1;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    background-color: #ff845e;
    box-shadow: rgba(0, 0, 125, 0.1) 0 0 3px 1px;
    font-size: 1.5rem;
  }

  .obstacle {
    width: 100%;
    height: auto;
    color: #dc3545;
  }

  .rover-icon {
    width: 100%;
    height: auto;
    color: #001c45;
  }

  /* Clases para las cuatro direcciones */
  .direction-n { transform: rotate(0deg); }
  .direction-e { transform: rotate(90deg); }
  .direction-s { transform: rotate(180deg); }
  .direction-w { transform: rotate(270deg); }
</style>

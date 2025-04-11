<script lang="ts">
  // Propiedades del componente
  export let onAddObstacle: () => void;
  export let onClearObstacles: () => void;
  
  // Número de obstáculos actuales
  export let obstaclesCount: number = 0;
  
  // Límite máximo de obstáculos (por defecto 50% del área del planeta)
  export let maxObstacles: number = 200; // Por defecto para un planeta 20x20
  
  // Propiedades calculadas
  $: canAddObstacle = obstaclesCount < maxObstacles;
  $: canClearObstacles = obstaclesCount > 0;
</script>

<div class="panel">
  <h2 class="panel-title">Obstaculos</h2>
  <p class="mb-2 text-sm">
    Total: {obstaclesCount}/{maxObstacles}
  </p>
  <div class="flex flex-row space-x-2">
    <button 
      on:click={onAddObstacle} 
      class="btn flex-1 {canAddObstacle ? 'btn-green hover:bg-green-600' : 'bg-gray-300 text-gray-400'}"
      title={!canAddObstacle ? "No se pueden agregar más obstáculos" : "Agregar obstáculo"}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="icon"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span class="btn-text">Agregar</span>
    </button>

    <button 
      on:click={onClearObstacles} 
      class="btn flex-1 {canClearObstacles ? 'btn-red hover:bg-red-600' : 'bg-gray-300 text-gray-400'}"
      title={!canClearObstacles ? "No hay obstáculos para eliminar" : "Eliminar todos los obstáculos"}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="icon"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
        />
      </svg>
      <span class="btn-text">Eliminar</span>
    </button>
  </div>
</div>

<style>
  .panel {
    background-color: var(--panel-bg, white);
    padding: 16px;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    color: #6c7e89;
    margin-bottom: 16px;
  }

  .panel-title {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    color: #000;
  }

  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    margin-right: 8px;
  }

  .btn {
    padding: 8px 16px;
    border-radius: 4px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .btn-green {
    background-color: var(--green-color, hsl(120, 100%, 35%));
    color: white;
  }

  .btn-red {
    background-color: var(--red-color, #dc2626);
    color: white;
  }
  
  /* Clases de Tailwind replicadas */
  .flex {
    display: flex;
  }
  
  .flex-row {
    flex-direction: row;
  }
  
  .flex-1 {
    flex: 1 1 0%;
  }
  
  .space-x-2 > * + * {
    margin-left: 0.5rem;
  }
  
  .mb-2 {
    margin-bottom: 0.5rem;
  }
  
  .text-sm {
    font-size: 0.875rem;
  }
  
  @media (max-width: 767px) {
    .btn-text {
      display: none;
    }
  }
</style> 
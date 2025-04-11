<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { fly } from "svelte/transition";
  import {
    AlertType,
    type ShowAlertEventDetail,
    SHOW_ALERT_EVENT,
  } from "../utils/simpleAlertUtils";

  let activeAlerts: (ShowAlertEventDetail & { id: number })[] = [];
  let nextId = 1;

  function handleShowAlert(e: CustomEvent<ShowAlertEventDetail>) {
    const { message, type, duration = 5000 } = e.detail;
    const id = nextId++;

    activeAlerts = [...activeAlerts, { id, message, type, duration }];

    setTimeout(() => {
      removeAlert(id);
    }, duration);
  }

  function removeAlert(id: number) {
    activeAlerts = activeAlerts.filter((alert) => alert.id !== id);
  }

  onMount(() => {
    document.addEventListener(
      SHOW_ALERT_EVENT,
      handleShowAlert as EventListener
    );
  });

  onDestroy(() => {
    document.removeEventListener(
      SHOW_ALERT_EVENT,
      handleShowAlert as EventListener
    );
  });

  function getAlertClass(type: AlertType): string {
    switch (type) {
      case AlertType.SUCCESS:
        return "alert-success";
      case AlertType.ERROR:
        return "alert-error";
      case AlertType.INFO:
        return "alert-info";
      case AlertType.ADVICE:
        return "alert-advice";
      default:
        return "alert-info";
    }
  }
</script>

<div class="alerts-container">
  {#each activeAlerts as alert (alert.id)}
    <div
      class="alert {getAlertClass(alert.type)}"
      transition:fly={{ y: -20, duration: 300 }}
    >
      <div class="alert-content">
        <span class="alert-message">{alert.message}</span>
        <button class="close-button" on:click={() => removeAlert(alert.id)}
          >×</button
        >
      </div>
    </div>
  {/each}
</div>

<style>
  .alerts-container {
    position: fixed;
    top: 1rem;
    right: 1rem;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    max-width: 25rem;
  }

  .alert {
    padding: 1rem;
    border-radius: 0.25rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    animation: fadeIn 0.3s ease-out;
    pointer-events: auto;
  }

  .alert-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .alert-message {
    margin-right: 1rem;
  }

  .close-button {
    background: transparent;
    border: none;
    font-size: 1.25rem;
    cursor: pointer;
    color: inherit;
    opacity: 0.7;
    line-height: 1;
    padding: 0;
    width: 1.5rem;
    height: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .close-button:hover {
    opacity: 1;
  }

  .alert-success {
    background-color: #d4edda;
    color: #155724;
    border-left: 4px solid #28a745;
  }

  .alert-error {
    background-color: #f8d7da;
    color: #721c24;
    border-left: 4px solid #dc3545;
  }

  .alert-info {
    background-color: #d1ecf1;
    color: #0c5460;
    border-left: 4px solid #17a2b8;
  }

  .alert-advice {
    background-color: #fff3cd;
    color: #856404;
    border-left: 4px solid #ffc107;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>

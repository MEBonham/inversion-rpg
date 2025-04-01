<script>
    import { page } from "$app/stores";
    import { Popover } from "bits-ui";
    import { modes } from "$lib/store.svelte.js";
    import DiceTray from "$lib/components/layout/DiceTray.svelte";
	import { ADMIN_AUTH } from "$lib/constants";

    let { closeFct = () => {} } = $props();
    const { data } = $page;
    
    let diceRollerSidebarIsOpen = $state(false);
    $effect(() => {
        modes.setDiceRollerMode(diceRollerSidebarIsOpen);
    });
</script>

<ul>
    <li>
        <a href="/campaigns" onclick={closeFct}>Campaigns</a>
    </li>
    <li>
        <a href="/characters" onclick={closeFct}>Characters</a>
    </li>
    {#if modes.isOnMobile}
        <li>
            <button onclick={() => {
                modes.setDiceRollerMode(!modes.diceRollerMode);
                closeFct();
            }}>
                {modes.diceRollerMode ? "Stop Rolling" : "Roll Dice"}
            </button>
        </li>
    {:else}
        <Popover.Root bind:open={diceRollerSidebarIsOpen}>
            <li>
                <Popover.Trigger>
                    {#snippet child({ props })}
                        <button {...props}>Dice Roller</button>                        
                    {/snippet}
                </Popover.Trigger>
                <DiceTray />
            </li>
        </Popover.Root>
    {/if}
    {#if data.profile}
        <li>
            <a href="/settings" onclick={closeFct}>Account & Settings</a>
        </li>
        {#if data.profile.auth_num >= ADMIN_AUTH}
            <li>
                <a href="/admin" onclick={closeFct}>Admin</a>
            </li>
        {/if}
    {:else}
        <li>
            <a href="/login" onclick={closeFct}>Login/Register</a>
        </li>
    {/if}
</ul>

<style>
    ul {
        height: 100%;
        padding: 1.4rem 3.4rem;
        display: flex;
        flex-direction: column;
        gap: 1.2rem;
        color: var(--consistentLight);
        font-size: 2.0rem;
    }
</style>

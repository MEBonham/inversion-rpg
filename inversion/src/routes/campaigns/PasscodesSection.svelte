<script>
    import { ContextMenu } from "bits-ui";
	import BufferDot from "$lib/components/BufferDot.svelte";
	import NormalForm from "$lib/components/NormalForm.svelte";
    import Button from "$lib/components/Button.svelte";
    import { handleSubmit } from "$lib/utils.js";

    let { profile } = $props();
    let copyOfLocalStoragePasscodes = $state();
    $effect(() => {
        if (window.localStorage.getItem("inversion-guest-passcodes") === null) {
            copyOfLocalStoragePasscodes = "[]";
        } else {
            copyOfLocalStoragePasscodes = window.localStorage.getItem("inversion-guest-passcodes");
        }
    });
    $effect(() => {
        if (copyOfLocalStoragePasscodes) {
            window.localStorage.setItem("inversion-guest-passcodes", copyOfLocalStoragePasscodes);
        }
    });

    let passcodes = $derived.by(() => {
        if (profile) {
            return profile.passcodes;
        }
        if (typeof document !== "undefined") {
            return JSON.parse(copyOfLocalStoragePasscodes || "[]");
        }
        return [];
    });

    const deleteGuestPasscode = (passcode) => {
        const array = JSON.parse(copyOfLocalStoragePasscodes);
        copyOfLocalStoragePasscodes = JSON.stringify(array.filter(p => p !== passcode));
    };
    const remoteDeleteFormSubmit = (passcode) => {
        const form = document.getElementById(`deleteForm^${passcode}`);
        form.requestSubmit();
    };

    let loading = $state(false);
</script>

{#snippet passcodeForm()}
    <footer>
        <input type="text" name="newPasscode" id="newPasscode" required />
        <Button type="submit" disabled={loading}>
            {loading ? "Loading ..." : "Add Passcode"}
        </Button>
    </footer>
{/snippet}

<section>
    <h2>Passcodes</h2>
    <p>
        {#if passcodes.length > 0}
            <BufferDot />
        {/if}
        {#each passcodes as passcode}
            <ContextMenu.Root>
                <ContextMenu.Trigger>
                    {#snippet child({ props })}
                        <span {...props} class="clickable">{passcode}</span>                        
                    {/snippet}
                </ContextMenu.Trigger>
                {#if profile}
                    <form id={`deleteForm^${passcode}`} method="post" action="?/deletePasscode" fct={() => handleSubmit(loading)} class="hideMe">
                        <input type="hidden" name="passcodeToDelete" value={passcode} />
                    </form>
                    <ContextMenu.Portal to="#liftPageContent">
                        <ContextMenu.Content>
                            <ContextMenu.Item>
                                <Button onclick={() => remoteDeleteFormSubmit(passcode)}>Delete {passcode}</Button>
                            </ContextMenu.Item>
                        </ContextMenu.Content>
                    </ContextMenu.Portal>
                {:else}
                    <ContextMenu.Portal to="#liftPageContent">
                        <ContextMenu.Content>
                            <ContextMenu.Item>
                                <Button onclick={() => deleteGuestPasscode(passcode)}>Delete {passcode}</Button>
                            </ContextMenu.Item>
                        </ContextMenu.Content>
                    </ContextMenu.Portal>
                {/if}
            </ContextMenu.Root>
            <BufferDot />
        {/each}
    </p>
    {#if profile}
        <NormalForm method="post" action="?/newPasscode" fct={() => handleSubmit(loading)}>
            {@render passcodeForm()}
        </NormalForm>
    {:else}
        <form onsubmit={(ev) => {
            const newPasscode = ev.target.newPasscode.value;
            copyOfLocalStoragePasscodes = JSON.stringify([...passcodes, newPasscode]);
            ev.target.newPasscode.value = "";
            ev.target.focus();
        }} class="showMe">
            {@render passcodeForm()}
        </form>
    {/if}
</section>

<style>
    form.hideMe {
        display: inline;
    }
    form.showMe {
        max-width: 100%;
        padding: 0.6rem 1.2rem;
        display: flex;
        flex-direction: column;
        gap: 0.8rem;

        & input {
            padding: 0.4rem;
            border-radius: 0.6rem;
            border: 1px solid hsl(0, 0%, 50%);
            background-color: ivory;
            color: var(--consistentDark);
        }
        & footer {
            width: 100%;
            display: flex;
            justify-content: flex-end;
            gap: 0.8rem;
        }
    }
    :global(div[data-menu-content]) {
        padding: 0.6rem;
    }
</style>

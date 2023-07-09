<script lang="ts">
  import { Button, Input, Select } from 'stwui'
  import { goto } from '$app/navigation'

  const services = [
    { value: 'sp', label: 'Spotify Playlist' }
  ]

  let selectValue = services[0]
  let inputValue = '2dTdVc7REpDxXw0V32vQIW'

  const handleClick = () => {
    goto('/' + selectValue.value + '/' + inputValue)
  }
</script>

<div class="w-full flex justify-center items-center">
  <div class="mt-16 w-96 flex flex-col">
    <Select name="select-1" bind:value={selectValue}>
      <Select.Options slot="options">
        {#each services as service}
          <Select.Options.Option option={service} />
        {/each}
      </Select.Options>
    </Select>
    <Input name="input" placeholder="Playlist ID" bind:value={inputValue} class="w-full"/>
    <Button type="primary" size="lg" class="w-full mt-1" on:click={handleClick}>
      Find
    </Button>
  </div>
</div>
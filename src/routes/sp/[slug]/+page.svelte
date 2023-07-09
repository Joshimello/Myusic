<script lang="ts">
  import { List, Button } from 'stwui'
  export let data
</script>

<div class="px-8">
  <List>
    {#each data.data as { name, artists, album }}
      <List.Item>
        <List.Item.Leading slot="leading">
          <List.Item.Leading.Avatar slot="avatar" src={album.images[2].url} />
        </List.Item.Leading>
        <List.Item.Content slot="content">
          <List.Item.Content.Title slot="title">
            {name}
          </List.Item.Content.Title>
          <List.Item.Content.Description slot="description">
            {artists.map(i => i.name).join(', ')}
          </List.Item.Content.Description>
        </List.Item.Content>
        <List.Item.Extra slot="extra" placement="start">
          <Button type="primary">
            ♫
          </Button>
        </List.Item.Extra>
      </List.Item>
    {/each}
  </List>
</div>
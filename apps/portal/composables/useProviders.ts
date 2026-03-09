interface Provider {
  label: string;
  name: string;
  disabled: boolean;
}

export function useProviders(currentProvider: string) {
  const providers = ref<Provider[]>([
    {
      label: 'Surfconext',
      name: 'oidc',
      disabled: Boolean(currentProvider === 'oidc'),
      icon: 'i-simple-icons-openid',
    },
  ])
  return {
    providers,
  }
}

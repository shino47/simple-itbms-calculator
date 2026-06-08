export default defineAppConfig({
  ui: {
    colors: {
      primary: 'cyan',
    },
    slideover: {
      slots: {
        overlay: 'fixed inset-0 bg-black/75',
      },
    },
    drawer: {
      slots: {
        overlay: 'fixed inset-0 bg-black/75',
      },
    },
    modal: {
      slots: {
        footer: 'flex justify-end items-center gap-3 p-4 sm:px-6',
      },
      variants: {
        overlay: {
          true: {
            overlay: 'bg-black/75',
          },
        },
      },
    },
  },
});

- Define purpose of application
- Define the pages the application will have
- Create Routing and Layout
  - Use the guide in docs/skills/create-Layout.md
- For each page we will define requirements and break them up into

  - UI
    - Consult lib/ui/src/docs/DesignSystem.mdx to understand the principles of the design system.
    - Including layout for the view and any component requirements
  - data
    - Definine one or more view models
  - functionality
    - Domain logic
    - Infrastructure requirements (database, local storage, external API, etc.)
    - Defined these requirements as usecases called from the view model

- Those usecases should then be developed via Domain Driven Development,

  - Consult domain/docs/creating_ddd_feature.md for this

- Finally define the adapters to be implemented in the app

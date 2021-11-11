export const itemNew = {
  item: {
    name: "New Test Item",
    giverId: 11123,
    active: true,
    status: "ONGOING",
    state: "NEW",
    category: "HOODIE",
    description: "Very cool hoodie up for grabs!",
  },
};

export const itemAdded = {
  addItem: {
    name: "New Test Item",
    id: 1,
    description: "Very cool hoodie up for grabs!",
    category: "HOODIE",
    images: null,
  },
};

export const updateItemObj = {
  id: 11217,
  item: {
    name: "Changed name",
    description: "Change desc",
    state: "GOOD",
    category: "DRESS",
  },
};

export const itemUpdated = {
  updateItem: {
    name: "Changed name",
    id: 11217,
  },
};

export const deletedItem = {
  deleteItem: {
    id: 11220,
  },
};

export const item111 = {
  getItem: {
    name: "discrete",
    id: 111,
    state: "NEW",
    status: "DRAFT",
    category: "OTHER",
    description: "In hac habitasse platea dictumst.",
    images: [
      {
        url: "http://localhost:4000/cheems_user.jpg",
        alt: "default",
      },
    ],
    giver: {
      username: "abeszantc",
      id: 1113,
      email: "abeszantc@usgs.gov",
    },
    wishers: [
      {
        id: 11123,
      },
    ],
    taker: null,
  },
};

export const itemsSearchItems = {
  input: {
    skip: 0,
    first: 10,
    view: "items",
    name: "pro",
  },
};

export const itemsSearchGiving = {
  input: {
    skip: 0,
    first: 100,
    view: "giving",
    userId: 11123,
    category: "SHORTS",
  },
};

export const itemsSearchTaken = {
  input: {
    skip: 0,
    first: 100,
    view: "taken",
    userId: 11123,
  },
};

export const itemsSearchGiven = {
  input: {
    skip: 0,
    first: 100,
    view: "given",
    userId: 11123,
  },
};

export const itemsSearchRes = {
  items: [
    {
      name: "Programmable",
      id: 11189,
      state: "NEW",
      status: "ONGOING",
      category: "COAT",
      description:
        "Donec quis orci eget orci vehicula condimentum. Curabitur in libero ut massa volutpat convallis.",
      images: [
        {
          url: "http://localhost:4000/cheems_user.jpg",
          alt: "default",
        },
      ],
      giver: {
        name: "Cleveland",
        id: 1121,
      },
    },
    {
      name: "Proactive",
      id: 11156,
      state: "BROKEN",
      status: "ONGOING",
      category: "SHORTS",
      description: "Integer tincidunt ante vel ipsum.",
      images: [
        {
          url: "http://localhost:4000/cheems_user.jpg",
          alt: "default",
        },
      ],
      giver: {
        name: "Travers",
        id: 1116,
      },
    },
    {
      name: "approach",
      id: 11141,
      state: "NEW",
      status: "ONGOING",
      category: "COAT",
      description: "Morbi a ipsum. Integer a nibh.",
      images: [
        {
          url: "http://localhost:4000/cheems_user.jpg",
          alt: "default",
        },
      ],
      giver: {
        name: "Anjanette",
        id: 1115,
      },
    },
    {
      name: "project",
      id: 1181,
      state: "NEW",
      status: "ONGOING",
      category: "COAT",
      description: "Fusce consequat.",
      images: [
        {
          url: "http://localhost:4000/cheems_user.jpg",
          alt: "default",
        },
      ],
      giver: {
        name: "Neils",
        id: 118,
      },
    },
  ],
};

export interface ProviderContact {
  name: string;
  location: string;
  phone: string;
  phone_href: string;
  email: string;
  contact_verified: boolean;
}

export interface Provider extends ProviderContact {
  id: number;
  category: string;
  description: string;
  average_service: string;
  average_cost: string;
  call_to_action: string;
  keywords: string[];
}

// Keep provider contact details in one place so the owner can verify or replace
// them without editing every service record.
export const providerContact: ProviderContact = {
  name: "Laughlin Maintenance Services",
  location: "La Brea",
  phone: "868-555-2033",
  phone_href: "tel:+18685552033",
  email: "service@laughlinmaintenance.com",
  contact_verified: false,
};

const serviceDefinitions: Array<
  Omit<Provider, keyof ProviderContact | "id">
> = [
  {
    category: "AC repair and maintenance",
    description:
      "Air-conditioning diagnostics, repairs, cleaning, and preventative maintenance for homes and businesses.",
    average_service: "AC diagnostic, cleaning, and basic maintenance",
    average_cost: "TTD $300-$650",
    call_to_action: "Request Quote",
    keywords: ["ac", "air conditioning", "air conditioner", "cooling"],
  },
  {
    category: "Plumbing",
    description:
      "Plumbing support for leaks, blocked drains, fixture repairs, and other common property plumbing problems.",
    average_service: "Leak inspection and minor pipe or fixture repair",
    average_cost: "TTD $250-$900",
    call_to_action: "Request Quote",
    keywords: ["plumber", "pipe", "leak", "drain", "faucet", "toilet"],
  },
  {
    category: "Electrical repairs",
    description:
      "Property electrical troubleshooting and repairs for outlets, switches, fixtures, and common electrical faults.",
    average_service: "Electrical fault inspection and minor repair",
    average_cost: "TTD $300-$1,200",
    call_to_action: "Request Quote",
    keywords: ["electrical", "electrician", "wiring", "outlet", "switch", "light"],
  },
  {
    category: "Painting",
    description:
      "Interior and exterior painting, including surface preparation, touch-ups, and complete repaints.",
    average_service: "Room preparation and repainting",
    average_cost: "TTD $800-$3,500",
    call_to_action: "Request Quote",
    keywords: ["paint", "painter", "repainting", "touch up"],
  },
  {
    category: "Pressure washing",
    description:
      "High-pressure exterior cleaning for driveways, walls, walkways, patios, and other property surfaces.",
    average_service: "Driveway or exterior wall pressure washing",
    average_cost: "TTD $400-$1,500",
    call_to_action: "Request Booking",
    keywords: ["power washing", "power wash", "pressure wash", "exterior cleaning"],
  },
  {
    category: "Lawn care",
    description:
      "Routine lawn and yard care for residential and commercial properties.",
    average_service: "Grass cutting, edging, and basic yard cleanup",
    average_cost: "TTD $250-$800",
    call_to_action: "Request Booking",
    keywords: ["grass", "yard", "garden", "landscaping", "mowing"],
  },
  {
    category: "Tree cutting",
    description:
      "Tree trimming and cutting for overgrown, hazardous, or unwanted trees around a property.",
    average_service: "Tree assessment, trimming, and debris removal",
    average_cost: "TTD $700-$4,000",
    call_to_action: "Request Quote",
    keywords: ["tree trimming", "tree removal", "branches", "pruning"],
  },
  {
    category: "General property maintenance",
    description:
      "Practical maintenance and repair support for everyday residential and commercial property needs.",
    average_service: "Property inspection and minor general repairs",
    average_cost: "TTD $300-$2,000",
    call_to_action: "Request Quote",
    keywords: [
      "general maintenance",
      "property repair",
      "property repairs",
      "handyman",
      "maintenance",
      "repair",
    ],
  },
];

export const providers: Provider[] = serviceDefinitions.map((service, index) => ({
  id: index + 1,
  ...providerContact,
  ...service,
}));

export const serviceCategories = providers.map((provider) => provider.category);

export const SUPPORTED_LOCATION = providerContact.location;

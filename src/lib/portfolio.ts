import { getCollection, type CollectionEntry } from "astro:content"

function compareProjectsByOrder(
  first: CollectionEntry<"portafolio">,
  second: CollectionEntry<"portafolio">,
) {
  return first.data.displayOrder - second.data.displayOrder
}

function isEditorialProject(entry: CollectionEntry<"portafolio">) {
  return !entry.data.fixture
}

function isTechnicalProjectFixture(entry: CollectionEntry<"portafolio">) {
  return entry.data.fixture
}

export async function getVisibleSpanishProjects(includeDrafts: boolean) {
  return (await getCollection("portafolio"))
    .filter(
      (entry) =>
        isEditorialProject(entry) &&
        (includeDrafts || !entry.data.draft) &&
        entry.data.language === "es",
    )
    .sort(compareProjectsByOrder)
}

export async function getDevelopmentSpanishProjectFixtures() {
  return (await getCollection("portafolio"))
    .filter(
      (entry) =>
        isTechnicalProjectFixture(entry) && entry.data.draft && entry.data.language === "es",
    )
    .sort(compareProjectsByOrder)
}

import { Page, Layout, BlockStack} from "@shopify/polaris";
import { Designer } from '~/components/Designer'


export default function Index() {

  return (
    <Page>
      <BlockStack gap="500">
        <Layout>
          <Layout.Section>
            <Designer/>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}

# 360ksiegowosc-node

## Install

```
npm install 360ksiegowosc-node
```

# Usage

```ts
import { Ksiegowosc360 } from "360ksiegowosc-node"

const ksiegowosc360 = new Ksiegowosc360("ApiId", "ApiKey")
const invoices = await ksiegowosc360.getInvoices()
```

To get `ApiId` and `ApiKey`, follow the docs https://api.merit.ee/connecting-robots/reference-manual/authentication/.

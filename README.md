# 360ksiegowosc-node

## Install

```
npm install 360ksiegowosc-node
```

# Usage

## Send message

```ts
import { Ksiegowosc360 } from "360ksiegowosc-node"

const ksiegowosc360 = new Ksiegowosc360("ApiId", "ApiKey")
const invoices = await ksiegowosc360.getInvoices()
```

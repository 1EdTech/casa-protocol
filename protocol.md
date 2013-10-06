# CASA PROTOCOL

# Introduction

## Status of this Memo

This document specifies the CASA (Community App Sharing Architecture) Protocol, which allows peers to propagate and share information about URIs in their ecosystem. The specification outlined forthwith is a work in progress and not intended for production use at this time. Distribution of this memo is unlimited.

## Copyright Notice

Copyright (c) 2013, Regents of the University of California. All rights reserved.

# Overview

This memorandum describes the CASA (Community App Sharing Architecture) Protocol. This protocol propagates URI knowledge across a peer-to-peer topology with support for heterogeneous and asymmetric world views. In this way, each peer may develop from its neighbors a knowledge of the  ecosystem as suited to its needs, taking into consideration trust relationships and policies around acceptance and sharing.

The motivating use case for this protocol is **web app stores**, such as in the context of a mobile dashboard, an IMS LTI Tool Consumer or a W3C Packaged Web Apps launcher. As such, this protocol originated as an attempt to serve this use cases; however, given its flexibility, it is generic enough to comport with other use cases whereby URIs and metadata are propagated across a peer-to-peer topology.

## Background

Information propagation throughout a network is conventionally handled as either:

* Complete Topology - Nodes in an infrastructure each contact every other node in the infrastructure in order to gain full knowledge of the environment. This approach requires `0.5*N*(N-1)` edges for `N` nodes, thus imposing a high control overhead to retain an accurate perception of the ecosystem.
* Star Topology - Nodes in an infrastructure each contact one central node to share their knowledge and collect knowledge from others. This approach requires a homogeneous world view and centralized trust, as well as placing significant load and responsibility upon the hub node.

Neither of these implementations adequately model the real world. Traditionally, web portals have built their ecosystem by directly contacting peers they trust and sharing apps among themselves. They neither have global knowledge nor resources to maintain a fully-connected mesh with all other peers in the network, nor will consensus ever be achieved to appoint a central hub.

## Solution

This protocol describes an approach that treats each organization in the network as an autonomous system. Under this scheme, each organization is responsible for defining its own peer trust, acceptance and sharing policies.

Each organization shall define its inbound and outbound peers:

* An inbound peer is a peer from which the node is willing to accept URI information; in order to know where to pull information from, an inbound peer is defined explicitly by hostname. 
* An outbound peer is a peer to which the peer is willing to share URI information; an outbound peer may be configured as a remote address, or as a remote address and a wildcard mask, allowing for broad sharing policies to be implemented.

While an organization may both accept from and share with a peer, this symmetry is not required. Further, when accepting applications from a peer, an organization may choose to accept only those that originate with the peer, or it may additionally accept applications that were shared with and propagated through the peer.

To facilitate a relatively automated process of propagation, each organization may define filters and transformations for both inbound and outbound data:

* Inbound filters may be used to drop URIs that are not suited for the organization's ecosystem.
* Inbound transformations allow an organization to curate URI metadata it accepts into its ecosystem.
* Outbound transformations are used to alter data when providing it out to other organizations.
* Outbound filters allow one to set rules that prevent sharing URIs not intended for peers.

## Use Cases

#### Mobile Dashboard

Many organizations with mobile web apps arrange them in a dashboard. In some cases, they make this dashboard configurable and seek out apps from peers. Further, they may choose to share their own apps with these or other peers.  For example take the case of the UC System, where a campus may have both location specific mobile web apps, as well as academic reference apps that can be shared.  An example of a mobile web app that can be referenced and shared as a resource is an organic chemistry glossary, where the glossary itself is a growing body of work.

Satisfaction of this use case requires that (1) the heterogeneous and asymmetric peering relationships must be satisfied and (2) it must be possible to filter URIs based on whether or not they provide a mobile view to content.

#### Tool Launcher

Content management systems, learning management systems, and many other versatile systems provide mechanisms for adding external tools. In some cases, such a tool is represented solely as a URI, while in other cases it has tighter integration achieved through standards such as IMS Learning Tools Interoperability (LTI) or W3C Packaged Web Apps (PWA).

Satisfaction of this use case requires that (1) an application may be launched directly by URI, (2) an outlet may be provided adequate information to launch the app with IMS LTI or W3C PWA and (3) an outlet can determine whether an IMS LTI or W3C PWA launch is required or the URI can also simply be launched directly. Further, this use case imposes that, while IMS LTI and W3C PWA are used as examples here, the mechanisms presented must be able to support any launch standard describable by metadata.

#### Authorization

Many applications implement authorization schemes. For example, an application may support only certain OAuth providers or a certain SAML-based schemes. In the case of SAML, even within a middleware such as Shibboleth, it may only support certain federations or identity providers. While authorization for a URI remains with the URI host, this protocol must adequately describe metadata such that a receiving peer may determine whether or not a URI is relevant or shall be dropped.

Satisfaction of this use case requires that authorization may be specified such that, if the peer does not recognize the scheme or does not support the properties specified by the scheme, then the URI is dropped.

## Terminology

### General

The key words **must**, **must not**, **required**, **shall**, **shall not**, **should**, **should not**, **recommended**, **may**, and **optional** in this document are to be interpreted as described by [RFC 2119](http://tools.ietf.org/rfc/rfc2119.txt) ["Key words for use in RFCs to Indicate Requirement Levels"].

The key word **UUID** (alternatively: **Universally Unique IDentifier**, **Globally Unique IDentifier**, **UUID** or **uuid**) in this document is to be interpreted as described by [RFC 4122](http://tools.ietf.org/rfc/rfc4122.txt) ["A Universally Unique IDentifier (UUID) URN Namespace"].

The key word **UID** (alternatively: **Unique IDentifier** or **uid**) in this document is to be interpreted as an identifier that is unique within the context of the payload originator.

The key words **node** and **peer** in this document are to be interpreted as an `Engine`, which may include payloads, may query other nodes, may respond to other nodes and may provide outlets.

The key word **RESTful web service** in this document is to be interpreted as a packet using HTTP methods as described by [RFC 2616](http://tools.ietf.org/rfc/rfc2616.txt) ["Hypertext Transfer Protocol -- HTTP/1.1"]. 

The key words **query** and **call** in this document are to be interpreted mean sending an RESTful web service interaction between two nodes. The key word **request** in this document is to be interpreted as a RESTful web service request; the key word **response** (alternatively for the action: **respond**) in this document is to be interpreted as a RESTful web service response.

The key word **originator** in this document is to be interpreted as the node that introduced a payload into the infrastructure. Each originator must define a UUID that uniquely identifies it across the network; further, each originator must also ensure that it assigns a UID for all payloads that it directly introduces into the network.

The key word **identity** in this document is to be interpreted as a composite key constructed from a UID identifying a payload within the originator and a UUID identifying the node within the network.

The key word **payload** in this document is to be interpreted as a data structure required minimally to include (1) an identity, comprised of a UID unique to the originator and the UUID of the originator, and (2) a set of attributes, minimally including a name and URI. Additionally, if a payload is propagated from a node besides the originator, it must also include a copy of the original attributes provided by the originator.

The key word **array** in this document is to be interpreted as an ordered data structure of elements with sequential numeric indices.

The key word **set** in this document is to be interpreted as an unordered data structure of elements.

The key word **object** in this document is to be interpreted as an unordered data structure of key-value pairs, referred to in language systems by terms including, but not limited to, "object", "associative array", "hash map", "dictionary" and "key-value store". The term **property** or **attribute** in this document may be interpreted as synonymous with **key** to mean a reference within the object that returns a **value**.

The key word **timestamp** in this document is to be interpreted as a string written in the format of [RFC 3339](http://tools.ietf.org/html/rfc3339) ["Date and Time on the Internet: Timestamps"].

The key word **wildcard mask** (alternatively: **mask**) in this document is to be interpreted as the binary inverse of the key word "network mask" as described by [RFC 4632](http://tools.ietf.org/rfc/rfc4632.txt) ["Classless Inter-domain Routing (CIDR)"].


The key word **JavaScript Object Notation** (alternatively: **JSON**) in this document is to be interpreted as the data format described by [RFC 4627](http://tools.ietf.org/rfc/rfc4627.txt) ["The application/json Media Type for JavaScript Object Notation (JSON)"].

The key word **JSON Schema** in this document is to be interpreted as a JSON format defined by the [json-schema-core](http://json-schema.org/latest/json-schema-core.html) ["JSON Schema: core definitions and terminology"] and [json-schema-validation](http://json-schema.org/latest/json-schema-validation.html) ["JSON Schema: interactive and non interactive validation"] specifications.

### Constituents

#### Engine

The `Engine` is a storage, querying and distribution routine that logically represents a node. 

The engine is responsible for:

1. Persistent storage of the node's relative ecosystem.
2. RESTful interfaces for managing payloads in the node's relative ecosystem.
3. RESTful interfaces for `AdjOutPeer` to query payloads from the node's relative ecosystem.
4. Scheduled job to query `AdjInPeer` RESTful interfaces to update the node's relative ecosystem.

#### AdjInPeer

An `AdjInPeer` is a peer that the `Engine` queries for payloads.

Payloads from an `AdjInPeer` are (1) translated to human-readable attributes by `AdjInTranslate`, (2) processed through `AdjInFilter` and (3) stored within the `AdjIn` structure. From there, the flow splits through (1) `AdjInTransform` to `Local` for dissemination to outlets and (2) `AdjOutTransform` to `AdjOut` for dissemination to `AdjOutPeer` nodes.

#### AdjOutPeer

An `AdjOutPeer` is a peer that the `Engine` allows to query it for payloads, both (1) that originate from the node and are flagged to be shared and (2) that originated from one of node's peers and were flagged to be propagated.

Payloads delivered to `AdjOutPeer` nodes begin at `AdjIn` for propagated URIs and `Local` for originated URIs. In both cases, payloads pass through `AdjOutTransform` before arriving at `AdjOut`. From `AdjOut`, payloads are then (1) processed by `AdjOutFilter`, (2) translated to machine-readable attributes by `AdjOutTranslate` and (3) delivered via HTTP response to the requesting `AdjOutPeer`.

#### Outlet

An outlet is an interface that delivers information based on the `Local` structure, represented as either:

* `ManagerOutlet` used to manage payloads, filters and transforms within the `Engine`.
* `LocalOutlet` used as a configurable portal such as a tool launcher or mobile dashboard.

Outlets derive their data from the `Local` structure, which includes payloads both originated at the node and retrieved from elsewhere in the network.

### Operations

#### AdjInTranslate

When a payload is received, the first step that must occur is translation of attributes from machine-readable attribute UUIDs to human-readable names configured by the peer. If there is no mapping for a machine-readable attribute UUID, it should not be affected by this process.

While machine-readable names avoid namespace conflicts in the peer-to-peer communication layer, it is more convenient to treat attributes by their human-readable names within a node and its outlets.

#### AdjInSquash

After a payload is translated by `AdjInTranslate` but before it is filtered by `AdjInFilter`, this phase sets up the `attributes` section by copying the `original` section and then walking through the elements in the `journal` sequentially and replacing attributes specified in each record. 

Additional logic is allowed within this phase, such as for conflict resolution between the journal and a previously witnessed journal, so long as it produces an idempotent `attributes` section if `AdjInSquash` is applied multiple times on the same received payload without other versions of the journal being introduced as well.

#### AdjInFilter

Once a payload has been translated and squashed, this phase drops payloads with attributes that do not meet configured constraints. This operation should be used to drop payloads that have requisites an organization does not support, and may also be used to drop applications that lack attributes an organization requires.

If a payload meets the `AdjInFilter` constraints, it shall be entered into `AdjIn`.

#### AdjInTransform

After a payload is written to `AdjIn`, it forks along a data path that takes it to `Local`. Before reaching `Local`, payloads must first pass through `AdjInTransform`. 

This routine allows a node to curate the way in which payloads are presented to outlets.

#### AdjOutTransform

All payloads being delivered to `AdjOut` must first pass through `AdjOutTransform`. 

These payloads originate from one of two locations based on their origin: (1) payloads shared from `AdjInPeer` nodes travel a data path from `AdjIn` and (2) payloads originating at the node travel a data path from `Local`.

This routine allows a node to curate the way in which payloads are presented to `AdjOutPeer` nodes.

#### AdjOutFilter

Payloads from `AdjOut` are dropped if they do not meet the constraints imposed by `AdjOutFilter`. 

These filters are typically used to drop payloads that will not be useful for other peers, such as those that have authorization restrictions. 

If a payload meets the `AdjOutFilter` constraints, then it will be provided in the response to queries from `AdjOutPeer` nodes.

#### AdjOutTransform

When preparing an HTTP response to an `AdjOutPeer` node, the last step before delivery is passing each payload through `AdjOutTransform`, which maps human-readable names configured by the peer into machine-readable attribute UUIDs. If there is no mapping for a human-readable name, and it is not of UUID form, then it should be discarded during this translation phase. However, if a name is already in UUID form and no mapping exists for it, then it should not be affected by this process.

While human-readable names are useful within a node and its outlets, machine-readable names avoid namespace conflicts in the peer-to-peer communication layer. This is particularly true when multiple attributes might be used to achieve functionality that might be given the same name but that has different mechanics.

### Data Structures

#### AdjIn

This structure contains payloads shared from or propagated through an `AdjInPeer` node, after being translated by `AdjInTranslate` and filtered by `AdjInFilter`.

#### Local

This structure contains payloads that either (1) originate directly from the node or (2) originate from an `AdjInPeer` node and shall have successfully passed through `AdjInTranslate`, `AdjInFilter` and `AdjInTransform`.

#### AdjOut

This structure contains payloads that either (1) originate directly from the node and passed through `AdjOutTransform` or (2) were received from an `AdjInPeer` node, are marked for propagation and have passed through `AdjInTranslate`, `AdjInFilter` and `AdjOutTransform`.

Payloads in this structure may be made available by the `Engine` when queried by an `AdjOutPeer` node, contingent on the fact that payloads made available must first pass through `AdjOutFilter` and `AdjOutTranslate`.

## User Characteristics

### Pull-based Protocol

All communication between nodes is pull-based. This allows nodes to configure their own refresh and expiration policies regarding payloads.

### Transport Security

This protocol recommends that all RESTful web services minimally implement transport layer security as defined by RFC 2818 ["HTTP over TLS"]. This provides reasonable assurances toward the provenance and integrity of data delivered to and from peers.

### Payload Trust

The use of transport layer security does not ensure the validity of the contents contained within a payload. A malicious peer may propagate payloads that do not conform to this protocol. Consequently, trust is required between a node and its direct peers. Further, if a node accepts URIs propagated through (rather than derived at) the `AdjInPeer`, then the node is implicitly trusting those indirect peers, or at least the representation provided by it's direct peer. Because this multi-hop trust may not always be desired, `AdjInFilter` may be used to only accept applications derived directly at the `AdjInPeer`.

### Machine-readable Attributes

In peer-to-peer communications, all attributes are defined through machine-readable UUIDs. This avoids namespace conflicts that might accrue when two peers define different attribute structures intended to serve similar purposes. However, through border translations, attributes within a node may be expressed by a human-readable equivalent. This equivalent is configured at the behest of the node, allowing two nodes to (1) interpret attributes differently or (2) to introduce new interpretations of a concept (like categories, tags or ratings) by simply introducing a new machine-readable attribute and interpreting module.

When a payload arrives at the border from an `AdjInPeer`, it is mapped to a human-readable equivalent as configured; similarly, before a payload leaves the border headed for an `AdjOutPeer`, it is mapped to its machine-readable form.

## Constraints

# Structures

## Node Structures

A node structures JSON Schema is available under [schema/node.json](schema/node.json).

### Node

The `Node` object is a logical representation of an entity that may interact with the `Engine`. However, this structure does not intrinsically provide authorization. Instead, authorization is derived from node subclasses including `AdjInPeer`, `AdjOutPeer` and `Outlet`.

The JSON Schema for `Node`:

```json
{
  "type": "object",
  "properties": {
    "name": { "type": "string" },
    "secret": { "type": "string" }
  },
  "required": [ "name" ]
}
```

An example of a `Node` structure:

```json
{
  "name": "Example",
  "secret": "foobar"
}
```

All `Node` objects must define a `name` property. This is a local reference to the node only, meaning that a peer may choose its own approach for naming nodes, but within a node, the name must be unique among all nodes defined within the `Engine`.

All `Node` objects may define a `secret` property. If the secret property is set, then it must be included in all RESTful web service requests issued against the `Engine`.

### AdjInPeer and AdjInPeerIdentity

The `AdjInPeer` object extends the `Node` object, specifying a peer that the `Engine` may query to retrieve payloads. In addition to the inherited properties of `Node`, an `AdjInPeer` object includes an additional `AdjInPeerIdentity` object under the key `in`.

The JSON Schema for `AdjInPeerIdentity` (see [schema/node.json](schema/node.json)):

```json
{
  "type": "object",
  "properties": {
    "hostname": { "type": "string" },
    "scheme": { "type": "string", "default": "https" },
    "path": { "type": "string", "default": "/" },
    "port": { "type": "integer", "default": 443, "minimum": 0, "maximum": 65535 }
  },
  "required": [ "hostname" ]
}
```

The JSON Schema for `AdjInPeer` (see [schema/node.json](schema/node.json)):

```json
{
  "type": "object",
  "properties": {
    "in": { "$ref": "#/definitions/AdjInPeerIdentity" }
  },
  "additionalProperties": { "$ref": "#/definitions/Node" },
  "required": [ "name", "in" ]
}
```


An example of an `AdjInPeer` structure:

```json
{
  "name": "Example",
  "secret": "foobar",
  "in": {
    "hostname": "localhost",
    "scheme": "http",
    "path": "/",
    "port": 8080
  }
}
```

All `AdjInPeer` objects must define an `in` property containing an `AdjInPeerIdentity` object. 

All `AdjInPeerIdentity` objects must define a `hostname` property. An `AdjInPeerIdentity` object may optionally include the additional attributes `scheme`, `path` and `port`; if any of these attributes are not set, the unset attributes default to `https`, `/` and `443` respectively.

The `in` object may be set in concurrence with an `out` property containing an `AdjOutPeerIdentity`. Under this case, the peer should be treated as both an `AdjInPeer` and an `AdjOutPeer`. See `AdjInOutPeer` for more.

### AdjOutPeer and AdjOutPeerIdentity


The `AdjOutPeer` object extends the `Node` object, specifying a peer to which the `Engine` will respond with a set of payloads from `AdjOut` when queried by a node with a matching `AdjOutPeerIdentity`. In addition to the inherited properties of `Node`, an `AdjOutPeer` object includes an additional `AdjOutPeerIdentity` object under the key `out`.

The JSON Schema for `AdjOutPeerIdentity` (see [schema/node.json](schema/node.json)):

```json
{
  "type": "object",
  "properties": {
    "address": { "type": "string" },
    "mask": { "type": "string" },
    "local": { "type": "boolean", "anyOf": [ false ], "default": false }
  },
  "required": [ "local" ]
}
```

The JSON Schema for `AdjOutPeer` (see [schema/node.json](schema/node.json)):

```json
{
  "type": "object",
  "properties": {
    "out": { "$ref": "#/definitions/AdjOutPeerIdentity" }
  },
  "additionalProperties": { "$ref": "#/definitions/Node" },
  "required": [ "name", "out" ]
}
```


An example of an `AdjOutPeer` structure:

```json
{
  "name": "Example",
  "secret": "foobar",
  "out"     : {
    "address": "10.0.0.0",
    "mask": "0.255.255.255",
    "local": false
  }
}
```

All `AdjOutPeer` objects must define an `out` property containing an `AdjOutPeerIdentity` object. 

All `AdjOutPeerIdentity` objects must either contain a `local` property set to `false` or else not contain a `local` property. An `AdjOutPeerIdentity` object may optionally include the additional attributes `address` and `mask`.

It is recommended that all `AdjOutPeerIdentity` objects contain an `address` property with an IP address value. If the `address` property is not defined, then the `Engine` shall respond to any request bearing the correct `name` and `secret` defined in the containing `AdjOutPeer` object. 

Additionally, the `AdjOutPeerIdentity` object may include a `mask` property with an wildcard value in the event that the `Engine` shall respond to any request issued within a subnet. If neither the `mask` nor the `hostname` property are set, then the `AdjOutPeerIdentity` should be regarded with a `mask` value of `255.255.255.255`. If the `mask` property is not set but the `hostname` property is set, then the `AdjOutPeerIdentity` should be regarded with a `mask` value of `0.0.0.0`.

The `out` object may be set in concurrence with an `in` property containing an `AdjInPeerIdentity`. Under this case, the peer should be treated as both an `AdjInPeer` and an `AdjOutPeer`. See `AdjInOutPeer` for more.

### AdjInOutPeer

The `AdjInOutPeer` object extends the `Node` object, specifying a peer that the `Engine` may query to retrieve payloads and to which the `Engine` will respond with a set of payloads from `AdjOut` when queried by a node with a matching `AdjOutPeerIdentity`. In addition to the inherited properties of `Node`, an `AdjInOutPeer` object must include an additional `AdjInPeerIdentity` under the key `in` and an `AdjOutPeerIdentity` under the key `out`.

The JSON Schema for `AdjInOutPeer` (see [schema/node.json](schema/node.json)):

```json
{
  "type": "object",
  "properties": {
    "in": { "$ref": "#/definitions/AdjInPeerIdentity" },
    "out": { "$ref": "#/definitions/AdjOutPeerIdentity" }
  },
  "additionalProperties": { "$ref": "#/definitions/Node" },
  "required": [ "name", "in", "out" ]
}
```


An example of an `AdjOutPeer` structure:

```json
{
  "name": "Example",
  "secret": "foobar",
  "in"     : {
    "hostname": "localhost",
    "scheme": "http",
    "path": "/",
    "port": 8080
  },
  "out"     : {
    "address": "127.0.0.1",
    "mask": "0.0.0.0",
    "local": false
  }
}
```

### Outlet

The `Outlet` object extends the `Node` object, specifying a peer to which the `Engine` will return a set of payloads from `Local`. In addition to the inherited properties of `Node`, an `Outlet` object includes an additional `OutletIdentity` object under the key `out`.

The JSON Schema for `OutletIdentity` (see [schema/node.json](schema/node.json)):

```json
{
  "title": "OutletIdentity",
  "type": "object",
  "properties": {
    "address": { "type": "string" },
    "mask": { "type": "string" },
    "local": { "type": "boolean", "anyOf": [ true ], "default": true },
    "manage": { "type": "boolean", "default": false }
  },
  "required": [ "local" ]
}
```

The JSON Schema for `Outlet` (see [schema/node.json](schema/node.json)):

```json
{
  "type": "object",
  "properties": {
    "out": { "$ref": "#/definitions/OutletIdentity" }
  },
  "additionalProperties": { "$ref": "#/definitions/Node" },
  "required": [ "name", "out" ]
}
```

An example of an `Outlet` structure:

```json
{
  "name": "Example",
  "secret": "foobar",
  "out"     : {
    "address": "10.0.0.0",
    "mask": "0.255.255.255",
    "local": true
  }
}
```

All `Outlet` objects must define an `out` property containing an `OutletIdentity` object. 

All `OutletIdentity` objects must either contain a `local` property set to `true`. An `OutletIdentity` object may optionally include the additional attributes `address`, `mask` and `manage`.

It is recommended that all `OutletIdentity` objects contain an `address` property with an IP address value. If the `address` property is not defined, then the `Engine` shall respond to any request bearing the correct `name` and `secret` defined in the containing `Outlet` object. 

Additionally, the `OutletIdentity` object may include a `mask` property with an wildcard value in the event that the `Engine` shall respond to any request issued within a subnet. If neither the `mask` nor the `hostname` property are set, then the `Outlet` should be regarded with a `mask` value of `255.255.255.255`. If the `mask` property is not set but the `hostname` property is set, then the `Outlet` should be regarded with a `mask` value of `0.0.0.0`.

The `OutletIdentity` may also include a `manage` property. If it contains a `manage` property set to `true`, then the `Outlet` may issue mutator (`POST`, `PUT` and `DELETE`) requests against the `Engine`. If the `manage` property is false or not set, then the `Outlet` will not have access to mutator requests.

An `Outlet` may not contain an `in` object.

## Payload

A payload represents a URI and associated metadata, and it is the fundamental unit accepted, presented and shared by a peer.

### Payload

The `Payload` object is the complete representation of a payload that a node maintains internally. It should be returned to `Outlets` with the `manage` flag set.

The JSON Schema for `Payload` (see [schema/payload.json](schema/payload.json)):

```json
{
  "type": "object",
  "properties": {
    "identity": { "$ref": "#/definitions/PayloadIdentity" },
    "original": { "$ref": "#/definitions/PayloadLocalAttributes" },
    "journal": { "type": "array", "items": { "$ref": "#/definitions/PayloadLocalJournalEntry" } },
    "attributes": { "$ref": "#/definitions/PayloadLocalAttributes" }
  },
  "required": [ "identity", "original", "attributes" ]
}
```

### TransitPayload

The `TransitPayload` object is the representation of a payload as an `AdjInPeer` should send when queried and that should be sent to a querying `AdjOutPeer`.

A `TransitPayload`:

* must include an `identity` property containing a `PayloadIdentity` object
* must include an `original` property containing a `PayloadTransitAttributes` object
* should include a `journal` structure containing an array of `PayloadTransitAttributes` object if any peer along the payload's route has made changes to the payload. 

As opposed to a `LocalPayload`, the `TransitPayload` should not include an `attributes` property containing a `PayloadAttributes` object, as the `attributes` property is computed by way of the `AdjInSquash` operation upon arrival. If a received `TransitPayload` includes an `attributes` property, that property should be discarded and a new version should be computed by way of `AdjInSquash`.

The JSON Schema for `TransitPayload` (see [schema/payload.json](schema/payload.json)):

```json
{
  "type": "object",
  "properties": {
    "identity": { "$ref": "#/definitions/PayloadIdentity" },
    "original": { "$ref": "#/definitions/PayloadTransitAttributes" },
    "journal": { "type": "array", "items": { "$ref": "#/definitions/PayloadTransitJournalEntry" } }
  },
  "required": [ "identity", "original" ]
}
```

### LocalPayload

The `LocalPayload` object is a representation of a payload as should be set to an `Outlet`, unless the `manage` flag set, in which case the full `Payload` object should be sent.

A `LocalPayload`:

* must include an `identity` property containing a `PayloadIdentity` object
* must include an `attributes` property containing a `PayloadLocalAttributes` object

The JSON Schema for `LocalPayload` (see [schema/payload.json](schema/payload.json)):

```json
{
  "type": "object",
  "properties": {
    "identity": { "$ref": "#/definitions/PayloadIdentity" },
    "attributes": { "$ref": "#/definitions/PayloadLocalAttributes" }
  },
  "required": [ "identity", "attributes" ]
}
```

### PayloadIdentity

The `PayloadIdentity` object is represented under the `identity` property of all `Payload`, `TransitPayload` and `LocalPayload` objects. It is a globally unique compound key that denotes the logical entity to which a payload pertains. This allows an originator to safely update any property in a payload message, so long as the `identity` is retained.

The JSON Schema for `PayloadIdentity` (see [schema/payload.json](schema/payload.json)):

```json
{
  "type": "object",
  "properties": {
    "id": { "type": "string" },
    "originator": { "type": "string", "pattern": "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$" }
  },
  "required": [ "id", "originator" ]
}
```

The `identity` property must exist on any payload. The `identity` property may not be modified once it is generated.

The `id` property must be a UID that is unique among all logical entities described by payloads. It is recommended, although not required, that the `id` property be generated as a UUID.

The `originator` property must be the UUID of the node that introduced the logical entity described by the payload. This UUID must conform to RFC 4122, and this UUID should be the same for all payloads introduced by the node.

### Journal

The journal is a history of all changes made to attributes since the definition of `Payload.original`. It is an array of zero or more objects, each which contain: the UUID of the node that orginates the change (`originator`); the timestamp when the change was made, in a format conforming to RFC 3339 (`timestamp`); and the changed values of the attributes. Equivalently, an element in the journal array reflects a set of changes to use and require attributes as made by author as of timestamp.

When a payload arrives at a node, the `PayloadTransitJournalEntry` objects of the `TransitPayload.journal` are converted to `PayloadLocalJournalEntry` objects as part of the `AdjInTranslate` operation that converts a `TransitPayload` to a `Payload`. Directly after this step, the `AdjInSquash` operation assesses `Payload.original` and then walks the journal in sequential array order, making changes per each `PayloadLocalJournalEntry`. The product of this process is the `Payload.attributes` property. The exact behavior of `AdjInSquash` may be customized within the local context, as the product attributes property is local to an individual node.

The journal property may exist for any payload that has been transmuted by the local node, as well as for any payload that has been transmuted by a peer that was not the originator of the payload. While the attributes section denotes the representation of the payload within the local context, the journal dictates changes to the payload in a broader context. See [PayloadLocalJournalEntry](#PayloadLocalJournalEntry) for specifics regarding creating, editing and deleting journal entries.

#### PayloadAbstractJournalEntry

The `PayloadAbstractJournalEntry` object is an abstract object that defines common attributes shared between the `PayloadTransitJournalEntry` and `PayloadLocalJournalEntry`. Its properties are also required by the `PayloadAbstractAttributes` object, and thus by `PayloadTransitAttributes` and `PayloadLocalAttributes`.

The JSON Schema for `PayloadAbstractJournalEntry` (see [schema/payload.json](schema/payload.json)):

```json
{
  "type": "object",
  "properties": {
    "originator": { "type": "string", "pattern": "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$" },
    "timestamp": { "type": "string", "format": "date-time" }
  }
}
```

The `originator` attribute must correspond to the UUID of the node that made the journal entry. If the payload originates from the node itself, the `originator` attribute should correspond to the node's UUID.

The `timestamp` attribute is a timestamp conforming to RFC 3339 and corresponding to the time when the journal entry was made.

#### PayloadTransitJournalEntry

The `PayloadTransitJournalEntry` object is composed of the properties from `PayloadAbstractJournalEntry`, plus `use` and `require` objects comprised of scalar, array or object values referenced by UUIDs as keys. 

For the properties within the `use` and `require` objects, each UUID corresponds to a module that exists on some node along the payload's path from its originator. This structure is used when receiving a `TransitPayload` from an `AdjInPeer` and when sending a `TransitPayload` to an `AdjOutPeer`; however, internally within engine rules (like filters and transformations), as well as when communicating with `Outlets`, the `PayloadLocalAttributes` structure should be used instead.

The JSON Schema for `PayloadTransitJournalEntry` (see [schema/payload.json](schema/payload.json)):

```json
{
  "type": "object",
  "properties": {
    "use": {
      "type": "object",
      "patternProperties": {
        "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$" : {
          "type": [ "array", "boolean", "integer", "null", "number", "object", "string" ]
        }
      },
      "default": {}
    },
    "require": {
      "type": "object",
      "patternProperties": {
        "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$" : {
          "type": [ "array", "boolean", "integer", "null", "number", "object", "string" ]
        }
      },
      "default": {}
    }
  },
  "additionalProperties": { "$ref": "#/definitions/PayloadAbstractJournalEntry/properties" },
  "required": [ "originator", "timestamp" ]
}
```

The `PayloadTransitJournalEntry` object is never operated on explicitly except to generate a `PayloadLocalJournalEntry` object by way of the `AdjInTranslate` operation or as generated from a `PayloadLocalJournalEntry` by way of the `AdjOutTranslate` operation.

#### PayloadLocalJournalEntry

The `PayloadLocalJournalEntry` object is composed of the properties from `PayloadAbstractJournalEntry`, plus `use` and `require` objects comprised of scalar, array or object values referenced by human-readable names as keys. 

For the properties within the `use` and `require` objects, each key is determine by way of translation from UUID to human-readable names based on a mapping local to the node. This structure is used internally within engine rules (like filters and transformations), as well as when communicated to `Outlets`; however, it should never be conveyed to an `AdjOutPeer`, and the `Attributes` object should be used in such cases.

The JSON Schema for `PayloadLocalJournalEntry` (see [schema/payload.json](schema/payload.json)):

```json
{
  "type": "object",
  "properties": {
    "use": {
      "type": "object",
      "patternProperties": {
        "." : {  "type": [ "array", "boolean", "integer", "null", "number", "object", "string" ] }
      },
      "default": {}
    },
    "require": {
      "type": "object",
      "patternProperties": {
        "." : { "type": [ "array", "boolean", "integer", "null", "number", "object", "string" ] }
      },
      "default": {}
    }
  },
  "additionalProperties": { "$ref": "#/definitions/PayloadAbstractJournalEntry/properties" },
  "required": [ "uri", "originator", "timestamp", "share", "propagate" ]
}
```

A `PayloadLocalJournalEntry` object is generated by way of the `AdjInTranslate` operation from each `PayloadTransitJournalEntry.journal` array element, and it is contained as an element within the `Payload.journal` array.

If `AdjOutTransform` changes any `Payload.attributes.use` or `Payload.attributes.require` attribute, a `PayloadLocalJournalEntry` object must be modified within `Payload.journal` as follows:

1. If the last element in the `Payload.journal` has an `originator` UUID corresponding to the UUID of the node, the element should be modified to make additional changes and the timestamp should be updated to the current time.
2. Otherwise, a new journal element should be appended to the end of the `Payload.journal` array. This element must include an `originator` property with an UUID corresponding to the id of the current node, the current timestamp conforming to RFC 3339, and either a use property or a require property or both corresponding to changes that the node made to the attributes by way of `AdjOutTransform`.

A `Payload.journal` entry may not be removed from `Payload.journal` unless it is the last element in `Payload.journal`, has an `originator` UUID corresponding to the UUID of the node and `AdjOutTransform` has not changed either `Payload.attributes.use` and `Payload.attributes.require`. Equivalently, the node may only remove the last `Payload.journal` entry if it has an `originator` UUID corresponding to the current node and the `Payload.attributes` values after `AdjInSquash` are equivalent to the attributes after `AdjOutTransform`.

### Attributes

Attributes describe the state of a payload at a particular point in the process. The `Payload.original` structure is a set of attributes as set by the originator when the payload was introduced into the network, and the `Payload.attributes` structure is a set of attributes computed by way of: `AdjInTranslate` to map from transit machine-readable UUID representation to local human-readable name representation; `AdjInSquash` to process `Payload.original` and `Payload.journal` to arrive at a set of `Payload.attributes` send from `AdjInPeer`; and either `AdjInTransform` for `Outlet` queries or `AdjOutTransform for `AdjOutPeer` queries to modify the `use` and `require` properties.

If `AdjOutTransform` modifies the `use` or `require` properties, a journal entry must be written.

The `attributes` property exists for any `Payload` delivered to an `Outlet`, either of the `Payload` or `LocalPayload` variety, while it should not be sent as part of a `TransitPayload` to an `AdjOutPeer`.

#### PayloadAbstractAttributes

The `PayloadAbstractAttributes` object is an abstract object that defines common attributes shared between `PayloadTransitAttributes` and `PayloadLocalAttributes`. It requires the properties of `PayloadAbstractJournalEntry`, plus the `uri`, `share` and `propagate` properties.

The JSON Schema for `PayloadAbstractAttributes` (see [schema/payload.json](schema/payload.json)):

```json
{
  "type": "object",
  "properties": {
    "uri": { "type": "string", "format": "uri" },
    "share": { "type": "boolean", "default": false },
    "propagate": { "type": "boolean", "default": false }
  },
  "additionalProperties": { "$ref": "#/definitions/PayloadAbstractJournalEntry/properties" },
  "required": ["uri", "originator", "timestamp", "share", "propagate"]
}
```

The `uri` property must be set and must define the URI for the payload.

The `share` property may be set. If `share` is not set or is `false`, then then engine should not share the payload with `AdjOutPeer` nodes, meaning that the payload should be dropped by `AdjOutFilter`.

The `propagate` property may be set. When received from an `AdjInPeer`, if `propagate` is not set or is false, then the node shall not share this payload with peers, meaning the payload should be dropped at `AdjOutFilter`; similarly, if `propagate` is not set or is false and the payload originates from the node, then it shall share the payload with its peers, but its peers shall not share it further.

#### PayloadTransitAttributes

The `PayloadTransitAttributes` object is composed of the properties from `PayloadAbstractAttributes` and `PayloadAbstractJournalEntry`, plus `use` and `require` objects comprised of scalar, array or object values referenced by UUIDs as keys. 

For the properties within the `use` and `require` objects, each UUID corresponds to a module that exists on some node along the payload's path from its originator. This structure is used only for the `original` property when receiving a `TransitPayload` from an `AdjInPeer` and when sending a `TransitPayload` to an `AdjOutPeer`; it is not used for an `attributes` property, as a `TransitPayload` should not include an attributes section.

The JSON Schema for `PayloadTransitAttributes` (see [schema/payload.json](schema/payload.json)):

```json
{
  "type": "object",
  "properties": {
    "use": {
      "type": "object",
      "patternProperties": {
        "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$" : {
          "type": [ "array", "boolean", "integer", "null", "number", "object", "string" ]
        }
      },
      "default": {}
    },
    "require": {
      "type": "object",
      "patternProperties": {
        "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$" : {
          "type": [ "array", "boolean", "integer", "null", "number", "object", "string" ]
        }
      },
      "default": {}
    }
  },
  "additionalProperties": { "$ref": "#/definitions/PayloadAbstractAttributes/properties" },
  "required": [ "uri", "originator", "timestamp", "share", "propagate" ]
}
```

The `PayloadTransitAttributes` object is never operated on explicitly except to generate a `PayloadLocalAttributes` object for `Payload.original` by way of the `AdjInTranslate` operation or as generated from the `PayloadLocalAttributes` object in `Payload.original` by way of the `AdjOutTranslate` operation before sending a `TransitPayload`.

#### PayloadLocalAttributes

The `PayloadLocalAttributes` object is composed of the properties from `PayloadAbstractAttributes` and `PayloadAbstractJournalEntry`, plus `use` and `require` objects comprised of scalar, array or object values referenced by human-readable names as keys. 

For the properties within the `use` and `require` objects, each key is determine by way of translation from UUID to human-readable names based on a mapping local to the node. This structure is used internally within engine rules (like filters and transformations), as well as when communicated to `Outlets`; however, it should never be conveyed to an `AdjOutPeer`, and the `Attributes` object should be used in such cases.

The JSON Schema for `PayloadLocalAttributes` (see [schema/payload.json](schema/payload.json)):

```json
{
  "type": "object",
  "properties": {
    "use": {
      "type": "object",
      "patternProperties": {
        "." : {  "type": [ "array", "boolean", "integer", "null", "number", "object", "string" ] }
      },
      "default": {}
    },
    "require": {
      "type": "object",
      "patternProperties": {
        "." : { "type": [ "array", "boolean", "integer", "null", "number", "object", "string" ] }
      },
      "default": {}
    }
  },
  "additionalProperties": { "$ref": "#/definitions/PayloadAbstractAttributes/properties" },
  "required": [ "uri", "originator", "timestamp", "share", "propagate" ]
}
```

The `use` property, if set for `Payload.attributes`, is an object which specifies metadata that a node may evaluate. It a node cannot evaluate an attribute within the `use` object because it does not have a module that recognizes the key, it should not drop the payload at `AdjInFilter` unless a filter is defined explicitly to this effect.

The `require` property, if set for `Payload.attributes`, is an object which specifies metadata that a node must evaluate. If a node cannot evaluate an attribute within the `require` object because it does not have a module that recognizes the key, it must drop the payload at `AdjInFilter`.

##### Properties for 'use'

**NON-NORMATIVE** This section is intended as an non-normative example of how the `use` attribute might be implemented.

Additionally, it should also be noted that payloads communicated between peers must use the machine-readable UUID mappings for human-readable attribute names.

##### Example: Common Website Properties

Some common properties for the `payload.attributes.use` object include:

```json
{
  "name" : { "type": "string" },
  "categories" : { "type": "array", "items": { "type": "string" } },
  "tags" : { "type": "array", "items" => { "type": "string" } },
  "icon" : { "type": "string", "format": "uri" },
  "capabilities" : {
    "type": "object"
    "properties": {
      "mobile": { "type": "boolean" },
      "tablet": { "type": "boolean" },
      "desktop": { "type": "boolean" },
      "responsive": { "type": "boolean" }
    }
  }
}
```

The `name` string may be used to define a name for the URI in the payload.

The `categories` array may be used to define zero or more categories that an `Outlet` may provide in its interface to provide a taxonomy for payloads. The values in this array may be modified by `AdjInTransform` to fit the categories used by `Outlet` nodes, and further it may be modified by `AdjOutTransform` to fit categorical expectations `AdjOutPeer` nodes may expect.

The `tags` array may be used to define zero or more keywords that an `Outlet` may provide in its interface to help search for payloads. Where categories are meant to define a taxonomy, tags are simply additional terms that may be helpful in describing a node. These may be modified similarly by `AdjInTransform` and `AdjOutTransform`, and they may also be used during `AdjInTransform` to advice on mapping a payload to categories that the node recognizes locally.

The `icon` string is intended to represent an `img[src]` value. This may be either a traditional web accessible URL or a data scheme such as `data:image/png;base64,...`.

The `capabilities` array is intended to provide a set of `true` or `false` values that represent things that a URI is capable of doing. The example above involves capabilities that specify whether payload is capable of supporting certain viewports or can responsively handle all viewports. These may be implemented, as may other capabilities not defined in the above example. Capabilities are useful for outlets such as a mobile dashboard, where it would not make sense to present a payload that only supports desktop viewports.

In a similar way, other capabilities such as an IMS Learning Tools Interoperability or W3C Packaged Web Apps launch might also be made available.

##### Properties for 'require'

**NON-NORMATIVE** This section is intended as an non-normative example of how the `require` attribute might be implemented.

Additionally, it should also be noted that payloads communicated between peers must use the machine-readable UUID mappings for human-readable attribute names.

###### Example: Shibboleth

Shibboleth is a SAML-based middleware that supports federation.

If an application requires Shibboleth for authorization, then it might be specified as such:

```json
{
  "shibboleth": true
}
```

If an application requires the InCommon Shibboleth federation, then it might be extended as:

```json
{
  "shibboleth": {
    "entityID": "urn:mace:incommon"
  }
}
```

If an application requires not only the InCommon Shibboleth federation but also authorizes only for particular identity providers, then it might be specified as:


```json
{
  "shibboleth": {
    "entityID": [
        "urn:mace:incommon:ucla.edu",
        "urn:mace:incommon:berkeley.edu",
    ]
  }
}
```

Similarly, if an application requires not only the InCommon Shibboleth federation but also authorizes only on particular attributes, then it might be specified as such:

```json
{
  "shibboleth": {
    "attributes": [
        "urn:mace:dir:attribute-def:eduPersonPrincipalName",
        "urn:oid:2.16.840.1.113916.1.1.4.1",
    ]
  }
}
```

In a similar way, other requirements such as an IMS Learning Tools Interoperability or W3C Packaged Web Apps launch might also be enforced.

# External Interfaces

**DEPRECATED WARNING** The data structures of this section are currently deprecated and require work to conform with the structures defined above in this document.

## GET payloads

Returns an array of `Payload` objects.

If the requesting agent is an `Outlet`, payloads are returned in the `LocalPayload` form, while, if the requesting agent is an `AdjOutPeer` node, payloads are returned in the `TransitPayload` form.

An error response is thrown if the request agent is not a valid `Outlet` or `AdjOutPeer`.

### Request

```
GET /payloads?name=[name]&secret=[secret] HTTP/1.1
```

### Response

#### 200 Success

##### LocalPayload for ManagerOutlet

Manager outlets receive the most extended form of the `LocalPayload`, including the `identity` and `attributes` sections required by the `LocalPayload`, as well as the `original` and `journal` properties for additional telemetry about the payload (if the payload did not originate locally):

```js
[
    {
        "identity" : {
            "id"            :   String,
            "originator"    :   String
        },
        "attributes" : {
            // .. (local attributes for the payload)
        },
        "original" : {
            // .. (original attributes of the payload, if not locally originated)
        } || undefined,
        "journal" : {
            // .. (journal for the payload, if not locally originated)
        } || undefined
    },
    // .. (additional payload objects)
]
```

##### LocalPayload for LocalOutlet

Non-manager outlets do not need the optional `original` or `journal` properties of the `LocalPayload`, so they are excluded to reduce the size of the payload:

```js
[
    {
        "identity" : {
            "id"            :   String,
            "originator"    :   String
        },
        "attributes" : {
            // .. (journal for the payload)
        }
    },
    // .. (additional payload objects)
]
```

##### TransitPayload for AdjOutPeer

AdjOutPeer nodes receive the `TransitPayload`, which should not include the `attributes` section of the payload:

```js
[
    {
        "identity" : {
            "id"            :   String,
            "originator"    :   String
        },
        "original" : {
            // .. (original attributes of the payload, if not locally originated)
        },
        "journal" : {
            // .. (journal for the payload, if not locally originated)
        } || undefined
    },
    // .. (additional payload objects)
]
```

#### 401 Unauthorized

```
Query string name property was not specified but is required.
```

```
Query string secret property was not specified but is required.
```

```
Query string secret property was not valid for node identified by name property.
```

## POST payloads

Creates a new `Payload` object JSON request body. This JSON request body should be solely the `attributes` values. This routine assigns `Payload[identity]` internally and returns it back as part of the `200 Success` response. The `Payload[original]` field is only added during delivery to `AdjOut` through `AdjOutTransform`. This allows for the `Engine` to determine which payloads are local, as they will not include a `Payload[original]` attribute within `Local`.

An error response will be thrown if the request agent is not a valid `ManagerOutlet`.

### Request

```
POST /payloads?name=[name]&secret=[secret] HTTP/1.1
```

```js
{
    // attributes..
}
```

### Response

#### 200 Success

Returns the `Payload` object with `attributes` from POST body and `identity` as assigned internally.

```js
{
    "identity" : {
        "id"            :   String,
        "originator"    :   String
    },
    "attributes" : {
        // .. (payload attributes)
    }
}
```

#### 401 Unauthorized

```
Query string name property was not specified but is required.
```

```
Query string secret property was not specified but is required.
```

```
Query string secret property was not valid for node identified by name property.
```

```
Query string secret and name properties are not valid for ManagerOutlet.
```

#### 409 Conflict

```
Payload already exists with identity. Use PUT payloads instead.
```

## PUT payloads

Updates an existing `Payload` object from the request body data if a payload currently exists with the same `Payload[identity]`. The `Payload[identity]` data must be included to identity the payload. `Payload[attributes]` data must be included and shall completely overwrite the old version of `attributes` per the HTTP PUT method definition. A `Payload[journal]` object may be included if the `Payload` did not originate from the `Engine`. The `Payload[journal]` object, if it exists, should represent a journal entry of changes that will be made to this object and propagated beyond this node. If a `Payload[journal]` is not included, then changes made by this call will not be propagated.

An error response will be thrown if the request agent is not a valid `ManagerOutlet`.

### Request

```
PUT /payloads?name=[name]&secret=[secret] HTTP/1.1
```

```js
{
    "identity": {
        "id"            :   String,
        "originator"    :   String
    },
    "attributes": {
        // rewrite of local attributes..
    },
    "journal": {
        // journal attribute changes..
    } || undefined
}
```

### Response

#### 200 Success

```js
[
    {
        "identity" : {
            "id"            :   String,
            "originator"    :   String
        },
        "attributes" : {
            // .. (local attributes for the payload)
        },
        "original" : {
            // .. (original attributes of the payload, if not locally originated)
        } || undefined,
        "journal" : {
            // .. (journal for the payload, if not locally originated)
        } || undefined
    },
    // .. (additional payload objects)
]
```

#### 401 Unauthorized

```
Query string name property was not specified but is required.
```

```
Query string secret property was not specified but is required.
```

```
Query string secret property was not valid for node identified by name property.
```

```
Query string secret and name properties are not valid for ManagerOutlet.
```

#### 404 Not Found

```
Payload does not exist with identity. Use POST payloads instead.
```

## DELETE payloads

Deletes an existing `Payload` object from the request body data if a payload currently exists with the same `Payload[:identity]`.

An error response will be thrown if the request agent is not a valid `ManagerOutlet` or there is no payload with the specified identity.

### Request

```
DELETE /payloads?name=[name]&secret=[secret] HTTP/1.1
```

```js
{
    "id"            :   String,
    "originator"    :   String
}
```

### Response

#### 204 No Content

```
Payload successfully deleted.
```

#### 401 Unauthorized

```
Query string name property was not specified but is required.
```

```
Query string secret property was not specified but is required.
```

```
Query string secret property was not valid for node identified by name property.
```

```
Query string secret and name properties are not valid for ManagerOutlet.
```

#### 404 Not Found

```
Payload does not exist with identity.
```

# Internal Routines

**DEPRECATED WARNING** The data structures of this section are currently deprecated and require work to conform with the structures defined above in this document.

**NON-NORMATIVE** This section is very incomplete and should be regarded as non-normative at this time; upon completion, it shall be classified as normative.

## FILTER-IN

Filter that runs on all payloads that arrives from any `AdjInPeer` before reaching `AdjIn`.

A payload must be dropped unless a module is running that supports each `:require` attribute:

```ruby
@attributes['required'].keys.each do |attribute_name|

  drop unless @modules.include? attribute_name

end
```

A payload must be dropped if one or more modules do not accept their corresponding `:require` attribute:

```ruby
@attributes['required'].each do |attribute_name, attribute|

  if @modules[attribute].respond_to? 'accepts?'
    drop unless @modules[attribute].accepts? attribute
  end

end
```

It is recommended that a payload be dropped if its creation time is older than the version already in persistence:

```ruby
drop if @original['timestamp'] < AdjIn.find(@identity).original['timestamp']
```

## TRANSFORM-IN

Transform that runs on all payloads from `AdjIn` before delivery to `Local`.

### ALWAYS

Payload not shared beyond node if propagation is not set true:

```ruby
unless payload[:attributes].has_key? :propagate and payload[:attributes][:propagate]
  payload[:attributes][:share] = false 
end
```

## TRANSFORM-OUT

Transform that runs on all payloads from `Local` before delivery to `AdjOut`.

### ALWAYS

Payloads in `Local` originating from the node itself do not have an `:original` field, so ensure that this field exists for all payloads in `AdjOut`:

```ruby
payload[:original] = payload[:attributes] unless payload.has_key? :original 
```

## FITLER-OUT

Filter that runs on all payloads in `AdjOut` before delivery to any `AdjOutPeer`.

### ALWAYS

Drop any application unless it is flagged for sharing:

```ruby
unless payload[:attributes].has_key? :share and payload[:attributes][:share]
  drop payload
end
```

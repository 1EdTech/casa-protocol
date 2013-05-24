# URI SHARING ENVIRONMENT (USE) PROTOCOL

# Introduction

## Status of this Memo

This document specifies the USE (URI Sharing Environment) Protocol, which allows peers to propagate and share information about URIs in their ecosystem. The specification outlined forthwith is a work in progress and not intended for production use at this time. Distribution of this memo is unlimited.

## Copyright Notice

Copyright (c) 2013, Regents of the University of California. All rights reserved.

# Overview

This memorandum describes the USE (URI Sharing Environment) Protocol. This protocol propagates URI knowledge across a peer-to-peer topology with support for heterogeneous and asymmetric world views. In this way, each peer may develop from its neighbors a knowledge of the  ecosystem as suited to its needs, taking into consideration trust relationships and policies around acceptance and sharing.

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

The key words **must**, **must not**, **required**, **shall**, **shall not**, **should**, **should not**, **recommended**, **may**, and **optional** in this document are to be interpreted as described by RFC 2119 ["Key words for use in RFCs to Indicate Requirement Levels"].

The key word **UUID** (alternatively: **Universally Unique IDentifier**, **Globally Unique IDentifier** or **UUID**) in this document is to be interpreted as described by RFC 4122 ["A Universally Unique IDentifier (UUID) URN Namespace"].

The key word **UID** (alternatively: **Unique IDentifier**) in this document is to be interpreted as an identifier that is unique within the context of the payload originator.

The key words **node** and **peer** in this document are to be interpreted as an `Engine`, which may include payloads, may query other nodes, may respond to other nodes and may provide outlets.

The key word **RESTful web service** in this document is to be interpreted as a packet using HTTP methods as described by RFC 2616 ["Hypertext Transfer Protocol -- HTTP/1.1"]. 

The key words **query** and **call** in this document are to be interpreted mean sending an RESTful web service interaction between two nodes. The key word **request** in this document is to be interpreted as a RESTful web service request; the key word **response** (alternatively for the action: **respond**) in this document is to be interpreted as a RESTful web service response.

The key word **originator** in this document is to be interpreted as the node that introduced a payload into the infrastructure. Each originator must define a UUID that uniquely identifies it across the network; further, each originator must also ensure that it assigns a UID for all payloads that it directly introduces into the network.

The key word **identity** in this document is to be interpreted as a composite key constructed from a UID identifying a payload within the originator and a UUID identifying the node within the network.

The key word **payload** in this document is to be interpreted as a data structure required minimally to include (1) an identity, comprised of a UID unique to the originator and the UUID of the originator, and (2) a set of attributes, minimally including a name and URI. Additionally, if a payload is propagated from a node besides the originator, it must also include a copy of the original attributes provided by the originator.

The key word **array** in this document is to be interpreted as an ordered data structure of elements with sequential numeric indices.

The key word **set** in this document is to be interpreted as an unordered data structure of elements.

The key word **object** in this document is to be interpreted as an unordered data structure of key-value pairs, referred to in language systems by terms including, but not limited to, "object", "associative array", "hash map", "dictionary" and "key-value store". The term **property** or **attribute** in this document may be interpreted as synonymous with **key** to mean a reference within the object that returns a **value**.

The key word **timestamp** in this document is to be interpreted as a string written in the format of ISO 8601 ["Representation of dates and times"], using the combined date and time format including the `T` delimiter between the date and time segments and the `Z` signifier when in the UTC timezone.

The key word **wildcard mask** (alternatively: **mask**) in this document is to be interpreted as the binary inverse of the key word "network mask" as described by RFC 4632 ["Classless Inter-domain Routing (CIDR)"].

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

### Mechanisms

#### AdjInTranslate

When a payload is received, the first step that must occur is translation of attributes from machine-readable attribute UUIDs to human-readable names configured by the peer. If there is no mapping for a machine-readable attribute UUID, it should not be affected by this process.

While machine-readable names avoid namespace conflicts in the peer-to-peer communication layer, it is more convenient to treat attributes by their human-readable names within a node and its outlets.

#### AdjInFilter

Once a payload has been translated, this phase drops payloads with attributes that do not meet configured constraints. This operation should be used to drop payloads that have requisites an organization does not support, and may also be used to drop applications that lack attributes an organization requires.

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

## Node

The `Node` object is a logical representation of an entity that may interact with the `Engine`. However, this structure does not intrinsically provide authorization. Instead, authorization is derived from node subclasses including `AdjInPeer`, `AdjOutPeer` and `Outlet`.

```ruby
{
  :name   => String,
  :secret => String || undefined
}
```

All `Node` objects must define a `:name` property. This is a local reference to the node only, meaning that a peer may choose its own approach for naming nodes, but within a node, the name must be unique among all peers defined within the `Engine`.

All `Node` objects may define a `:secret` property. If the secret property is set, then it must be included in all RESTful web service requests issued against the `Engine`.

### AdjInPeer

The `AdjInPeer` object extends the `Node` object, specifying a peer that the `Engine` may query to retrieve payloads.

```ruby
{
  :name   => String,
  :secret => String || undefined,
  :in     => {
    :hostname => String,
    :scheme   => String || undefined,
    :path     => String || undefined,
    :port     => String || undefined
  }
}
```

All `AdjInPeer` objects must define an `:in` property (alternatively: `:in` object) containing an object that must include a `:hostname:` attribute. 

The `:in` object may optionally include the additional attributes `:scheme`, `:path` and `:port`; if any of these attributes are not set, the unset attributes default to `https`, `/` and `443` respectively.

The `:in` object may be set in concurrence with an `:out` object to classify a peer as both an `AdjInPeer` and either an `AdjOutPeer` or an `Outlet`.

### AdjOutPeer

The `AdjOutPeer` object extends the `Node` object, specifying a peer to which the `Engine` will return a set of payloads from `AdjOut` after passing through `AdjOutFilter`.

```ruby
{
  :name   => String,
  :secret => String || undefined,
  :out    => {
    :address => String || undefined,
    :mask    => String || undefined,
    :local   => false
  }
}
```

All `AdjOutPeer` objects must define an `:out` property (alternatively: `:out` object) containing an object that must include a `:local` property set to `false`. 

It is recommended that the `:out` property also contains an `:address` property with an IP address value. If the `:address` property is not defined, then the `Engine` shall respond to any request bearing the correct `:name` and `:secret`. Additionally, the `:out` property may include a `:mask` property with an wildcard value in the event that the `Engine` shall respond to any request issued by an `Outlet` within a subnet.

The `:out` object may be set in concurrence with an `:in` object to classify a peer as both an `AdjInPeer` and  an `AdjOutPeer`.

### Outlet

The `Outlet` object extends the `Node` object, specifying a peer to which the `Engine` will return a set of payloads from `Local`.

```ruby
{
  :name   => String,
  :secret   =>    String || undefined,
  :response =>    {
    :address  =>  String || undefined,
    :mask     =>  String || undefined,
    :local    =>  true,
    :manage   =>  true || false || undefined
  }
}
```

All `Local` objects must define an `:out` property (alternatively: `:out` object) containing an object that must include a `:local` property set to `true`.

The `:out` property may include a `:manage` property, in which case the `Outlet` will be treated as a `ManagerOutlet`. A `ManagerOutlet` may issue mutator (POST, PUT and DELETE) requests against the `Engine` to modify data in `Local`, as well as to modify `AdjInFilter`, `AdjInTransform`, `AdjOutTransform` and `AdjOutFilter`. If the `:manage` property is false or undefined, then the `Outlet` will not have access to mutator requests.

The `:out` property may also contains an `:address` property with an IP address value. This is recommended for `ManagerOutlet` nodes. If the `:address` property is defined, the `Engine` shall respond to requests bearing the correct `:name` and `:secret` only if the requesting agent is from `:address`. Additionally, the `:out` property may include a `:mask` property with a wildcard mask value in the event that the `Engine` shall respond to any request issued by an `Outlet` within a subnet.

The `:out` object may be set in concurrence with an `:in` object to classify a peer as both an `AdjInPeer` and an `Outlet`.

The `:request` property may be concurrently set on a peer to make it both an `Outlet` and an `AdjInPeer`.

## Payload

A `payload` represents a URI and associated metadata, and it is the fundamental unit accepted, presented and shared by a peer.

A `payload` comes in two formats:

* **TransitPayload** is how a payload is communicated between peers. It must include `identity` and `original` structures, and should include a `journal` structure if any peer along the payload's route has made changes to the payload. It does not include the `attributes` structure, as that structure is computed upon arrival at a peer. All attributes in the TransitPayload structures must be expressed in their machine-readable representation.
* **LocalPayload** is how a payload is managed locally in filters and transforms, as well as how it's produced to outlets. It must include `identity` and `attributes` sections. Further, if it does not originate at the current host, it must maintain the existing `original` and `journal` structures. All known attributes in the LocalPayload structures should be expressed in their human-readable representation.

If originated from the node itself, the LocalPayload `attributes` section is explicitly defined. In all other cases, when received from an adjacent node, the `attributes` section of a payload is defined by squashing the `original` and `journal` sections of a payload, potentially also considering known attributes for a payload in the local node with the same identity. 

### TransitPayload

```ruby
{
  'identity' => {
    'id'          => String(UUID),
    'originator'  => String(UUID)
  },
  'original' => {
    'uri'  => String,
    'share' => true || false,
    'propagate' => true || false,
    'author' => {
      'id' => String(UUID),
      'name' => String,
      'uri' => String(URI)
    },
    'timestamp' => String(Timestamp),
    'use' => {
      # .. (original 'use' structure)
    } || undefined,
    'require' => {
      # .. (original 'require' structure)
    } || undefined
  },
  'journal'  => [
    {
      'author' => {
        'id' => String(UUID),
        'name' => String,
        'uri' => String(URI)
      },
      'timestamp'  => String(Timestamp),
      'use' => {
        # .. (journal of modifications to 'use' structure)
      } || undefined,
      'require' => {
        # .. (journal of modifications to 'require' structure)
      } || undefined
    }
  ] || [] || undefined
}
```

### LocalPayload

```ruby
{
  'identity' => {
    'id'          => String(UUID),
    'originator'  => String(UUID)
  },
  'original' => {
    'uri'  => String,
    'share' => true || false,
    'propagate' => true || false,
    'author' => {
      'id' => String(UUID),
      'name' => String,
      'uri' => String(URI)
    },
    'timestamp' => String(Timestamp),
    'use' => {
      # .. (original 'use' structure)
    } || undefined,
    'require' => {
      # .. (original 'require' structure)
    } || undefined
  } || undefined,
  'journal'  => [
    {
      'author' => {
        'id' => String(UUID),
        'name' => String,
        'uri' => String(URI)
      },
      'timestamp'  => String(Timestamp),
      'use' => {
        # .. (journal of modifications to 'use' structure)
      } || undefined,
      'require' => {
        # .. (journal of modifications to 'require' structure)
      } || undefined
    }
  ] || [] || undefined,
  'attributes' => {
    'uri'  => String,
    'author' => {
      'id' => String(UUID),
      'name' => String,
      'uri' => String(URI)
    },
    'timestamp' => String(Timestamp),
    'share' => true || false,
    'propagate' => true || false,
    'use' => {
      # .. (original 'use' structure)
    } || undefined,
    'require' => {
      # .. (original 'require' structure)
    } || undefined
  }
}
```

When a `LocalPayload` is returned to an Outlet, it is recommended that the `original` and `journal` attributes are dropped to reduce the payload size, as the squashed representation is contained in full by the `attributes` section.

### Payload Components

#### Identity

The `identity` property is a globally unique compound key that denotes the logical entity to which a payload pertains. This allows an originator to safely update any property in a payload message, so long as the `identity` is retained.

The `identity` property must exist for any payload. This property is an object that must contain:

* `id` UID string, unique within the originator for the particular payload
* `originator` UUID string, used for all payloads generated by the same engine

The `identity` property may not be modified once it is generated.

##### Identity Structure

```ruby
{
  'id'          => String(UID),
  'originator'  => String(UUID)
}
```

* `id` [Required] - The `id` property must be a UID that is unique among all logical entities described by payloads. It is recommended, although not required, that the `id` property be generated as a UUID.
* `originator` [Required] - The `originator` property must be the UUID of the node that introduced the logical entity described by the payload. This UUID must conform to RFC 4122, and this UUID should be the same for all payloads introduced by the node.

#### Attributes

The `attributes` property is an object that defines the local representation of a payload.

The `attributes` property must exist for any payload that is sent to an outlet (LocalPayload); however, the `attributes` property is considered local in context, so it should not be sent to adjacent peers (TransitPayload). To accomplish this, the `attributes` property must be computed by `AdjInSquash` and should be removed by `AdjOutTransform`.

The `attributes` property may be modified by any Outlet, affecting the Payload's metadata local to the Engine. For an attribute modification to be reflected beyond the local context, it must also be written to the `journal`.

##### Attributes Structure

```ruby
{
  'uri'  => String,
  'author' => {
    'id' => String(UUID),
    'name' => String,
    'uri' => String(URI)
  },
  'timestamp' => String(Timestamp),
  'share' => true || false,
  'propagate' => true || false,
  'use' => {
    # .. (original 'use' structure)
  } || undefined,
  'require' => {
    # .. (original 'require' structure)
  } || undefined
}
```

* `uri` [Required] - The `uri` property defines the URI of the payload.
* `author` [Required] - The `author` property is an object that includes the following properties from the originator:
 * `id` [Required] - The UUID of the originator (same as the `originator` property of `identity`).
 * `name` [Required] - A human-readable name that identifies the originator.
 * `uri` [Optional] - A URI that may be used to query the originator directly.
* `timestamp` [Required] - A timestamp string formatted as ISO 8601 which references the latest change to the payload, including from changes computed during `AdjInSquash` from `journal` entries and changes made to the `attributes` section locally. It must include the `T` delimiter, the `Z` timezone if UTC, and the hours, minutes and seconds fields.
* `share` [Optional] - If set false or undefined, the engine should not share the payload with `AdjOutPeer` nodes. This means that the payload shall be dropped by `AdjOutFilter`.
* `propagate` [Optional] - If set false or undefined and received from an `AdjInPeer`, the node shall not share this node with peers. However, if set false or undefined but the payload originates from the node, then it shall share the payload with its peers, although it's peers will not share it further. This means that the payload shall be dropped by `AdjOutFilter`.
* `use` [Optional] - The `use` property is an object that may be included which specifies metadata that a node may evaluate. If a node cannot evaluate an attribute within the `use` object, it should not drop the payload at `AdjInFilter` unless a filter is defined explicitly to this effect.
* `require` [Optional] - The `require` property is an object that may be included which specifies metadata that a node must evaluate. If a node cannot evaluate an attribute within this object, or if a node evaluates the metadata as not having the specified requirements, then it must drop the payload at `AdjInFilter`.

All attributes within the `use` and `require` objects are expressed as human-readable names within the node (translated from UUID to name `AdjInTranslate` for propagated payloads), while they are expressed as machine-readable UUIDs when being shared with other nodes (translated from name to UUID `AdjOutTranslate`).

#### Original

The `original` property is an object that must contain the `attributes` section set by the originator.

The `original` property must exist for any payload that a node sends to an adjacent peer (TransitPayload); consequently, it should exist on any payload received from an adjacent peer. To accomplish this, if the `original` property does not exist when a payload reaches AdjOutTransform, it should be generated at that time from the `attributes` property.

The `original` property may not be modified once it is generated.

##### Original Structure

The original attributes structure definition is identical to the attributes structure definition.

#### Journal

The `journal` property is an array of zero or more objects that contain an `author` section, a `timestamp` and either a `use` section or a `require` section or both. An element in the `journal` array reflects a set of changes to `use` and `require` attributes as made by `author` as of `timestamp`.

When a payload arrives at a node, the AdjInSquash phase is responsible for assessing the `original` property and applying changes from the `journal` in sequential array order to produce an `attributes` property for the payload. The exact behavior of AdjInSquash may be customized within the local context, as the product `attributes` property is local to an individual node.

The `journal` property may exist for any payload that has been transmuted by the local node, as well as for any payload that has been transmuted by a peer that was not the originator of the payload. While the `attributes` section denotes the representation of the payload within the local context, the journal dictates changes to the payload in a broader context.

The `journal` property may be modified in one of two ways:

1. If the last element in `journal` has an `author` block with an `id` corresponding to the `id` of the current node, then the element should be modified to make additional changes and the `timestamp` should be updated to the current time.
2. Otherwise, a new journal element should be appended to the end of the array. This element must include an `author` block with an `id` corresponding to the `id` of the current node, the current `timestamp` and either a `use` property or a `require` property or both.

##### Journal Structure

The journal is an array of journal elements.

Each element is defined as:

```ruby
{
  'author' => {
    'id' => String(UUID),
    'name' => String,
    'uri' => String(URI)
  },
  'timestamp' => String(Timestamp),
  'use' => {
    # .. (original 'use' structure)
  } || undefined,
  'require' => {
    # .. (original 'require' structure)
  } || undefined
}
```

* `author` [Required] - The `author` property is an object that includes the following properties from the node that added this journal entry:
 * `id` [Required] - The UUID of the node that added the journal entry.
 * `name` [Required] - A human-readable name that identifies the node that added the journal entry.
 * `uri` [Optional] - A URI that may be used to query the node that added the journal entry directly.
* `use` [Optional] - The `use` property is an object that may be included which specifies sequential alterations to the metadata as defined by the `original` property of the payload, plus any changes defined by earlier elements in the `journal` structure.
* `require` [Optional] - The `require` property is an object that may be included which specifies sequential alterations to the metadata as defined by the `original` property of the payload, plus any changes defined by earlier elements in the `journal` structure.

All attributes within the `use` and `require` objects are expressed as human-readable names within the node (translated from UUID to name `AdjInTranslate` for propagated payloads), while they are expressed as machine-readable UUIDs when being shared with other nodes (translated from name to UUID `AdjOutTranslate`).

### Properties for 'use'

**NON-NORMATIVE** This section is intended as an non-normative example of how the `use` attribute might be implemented. It should not be regarded as part of the protocol at this time, and the very structure of the `:use` property here might change completely before final implementation.

Additionally, it should also be noted that payloads communicated between peers must use the machine-readable UUID mappings for human-readable attribute names.

#### Example: Common Website Properties

Some common properties for the `payload[:attributes][:use]` object include:

```ruby
{
  # ..
  'attributes' => {
    # ..
    'use' => {
      'name'         => String || undefined,
      'categories'   => Array(String) || undefined,
      'tags'         => Array(String) || undefined,
      'icon'         => String || undefined,
      'capabilities' => {
        'mobile'     => true || false || undefined,
        'tablet'     => true || false || undefined,
        'desktop'    => true || false || undefined,
        'responsive' => true || false || undefined
      }
      # ..
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

### Properties for :require

**NON-NORMATIVE** This section is intended as an non-normative example of how the `:require` attribute might be implemented. It should not be regarded as part of the protocol at this time, and the very structure of the `:require` property here might change completely before final implementation.

Additionally, it should also be noted that payloads communicated between peers must use the machine-readable UUID mappings for human-readable attribute names.

#### Example: Shibboleth

Shibboleth is a SAML-based middleware that supports federation.

If an application requires Shibboleth for authorization, then it might be specified as such:

```ruby
{
  # ..
  'attributes' => {
    # ..
    'require' => {
      'shibboleth' => true
      # ..
    }
  }
}
```

If an application requires the InCommon Shibboleth federation, then it might be extended as:

```ruby
{
  # ..
  'attributes' => {
    # ..
    'require' => {
      'shibboleth' => {
        'entityID' => 'urn:mace:incommon'
      }
      # ..
    }
  }
}
```

If an application requires not only the InCommon Shibboleth federation but also authorizes only for particular identity providers, then it might be specified as:

```ruby
{
  # ..
  'attributes' => {
    # ..
    'require' => {
      'shibboleth' => {
        'entityID' => [
           'urn:mace:incommon:ucla.edu',
           'urn:mace:incommon:berkeley.edu',
           # ..
         ]
      }
      # ..
    }
  }
}
```

Similarly, if an application requires not only the InCommon Shibboleth federation but also authorizes only on particular attributes, then it might be specified as such:

```ruby
{
  # ..
  'attributes' => {
    # ..
    'require' => {
      'shibboleth' => {
        'attributes' => [
           # eduPerson Attribute
           'urn:mace:dir:attribute-def:eduPersonPrincipalName',
           # UCTrust Attribute
           'urn:oid:2.16.840.1.113916.1.1.4.1',
           # ..
         ]
      }
      # ..
    }
  }
}
```

In a similar way, other requirements such as an IMS Learning Tools Interoperability or W3C Packaged Web Apps launch might also be enforced.

# External Interfaces

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
        // .. (journal for the payload)
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
        // attributes..
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

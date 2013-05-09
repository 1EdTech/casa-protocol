# Introduction

## Status of this Memo

This document specifies the USE (URI Sharing Environment) Protocol, which allows peers to propagate and share information about URIs in their ecosystem. The specification outlined forthwith is a work in progress and not intended for production use at this time. Distribution of this memo is unlimited.

## Copyright Notice

Copyright (c) 2013, Regents of the University of California. All rights reserved.

# Overview

This memorandum describes the USE (URI Sharing Environment) Protocol. This protocol propagates URI knowledge across a peer-to-peer topology with support for heterogeneous and asymmetric world views. In this way, each peer may develop from its neighbors a knowledge of the  ecosystem as suited to its needs, taking into consideration trust relationships and policies around acceptance and sharing.

 The motivating use case for this protocol is for **web app stores**, such as in the context of a mobile dashboard, an IMS LTI Tool Consumer, or a W3C Packaged Web Apps launcher. As such, initial work on this protocol originated from a desire to flexibly serve such use cases. However, it is generic enough to comport to any use case whereby URIs are propagated across a peer-to-peer topology, including where peers have heterogeneous and asymmetric world views.

## Background

Information propagation throughout a network is conventionally handled as either:

* Complete Topology - Nodes in an infrastructure each contact every other node in the infrastructure in order to gain full knowledge of the environment. This approach requires `0.5*N*(N-1)` edges for `N` nodes, thus imposing a high control overhead to retain an accurate perception of the ecosystem.
* Star Topology - Nodes in an infrastructure each contact one central node to share their knowledge and collect knowledge from others. This approach requires a homogeneous world view and centralized trust, as well as placing significant load and responsibility upon the hub node.

Neither of these implementations adequately model the real world in the context of **web app stores**. Traditionally, web portals have built their ecosystem by directly contacting peers they trust and sharing apps among themselves. They neither have the global knowledge or resources to maintain a fully-connected mesh with all other peers in the network, nor will there ever be a complete consensus to appoint a central hub.  The success of the Internet is in fact due to a lack of a central hub.

## Solution

This protocol describes an approach that treats each organization in the network as an autonomous system. Under this scheme, each organization is responsible for defining it's own peer trust, acceptance and sharing policies.

Each organization shall define its inbound and outbound peers:

* An inbound peer is a peer from which the node is willing to accept URI information; in order to know where to pull information from, an inbound peer is defined explicitly by hostname, 

* An outbound peer is a peer to which the peer is willing to share URI information; an outbound peer may be configured as solely a remote address, or as a remote address and a netmask, allowing for broad sharing policies to be implemented.

 While an organization may both accept from and share with a peer, this symmetry is not required. Further, when accepting applications from a peer, an organization may choose to accept only those that originate with the peer, or it may additionally accept applications that were shared with and propagated through the peer.

To facilitate a relatively automated process of propagation, each organization may define filters and transformations for both inbound and outbound data:

* Inbound filters may be used to drop URIs that are not suited for the organization's ecosystem.
* Inbound transformations allow an organization to curate URI metadata it accepts into its ecosystem.
* Outbound transformations are used to alter data when providing it out to other organizations.
* Outbound filters allow one to set rules that prevent sharing URIs not intended for peers.

## Use Cases

#### Mobile Dashboard

Many organizations with mobile web apps arrange them in a dashboard. In some cases, they make this dashboard configurable and seek out apps from peers. Further, they may choose to share their own apps with these or other peers.  For example take the case of the UC System, where a campus may have both location specific mobile web apps, as well as academic reference apps that can be shared.  An example of an app that can be referenced and shared as a resource is an organic chemistry glossary, where the glossary itself is a growing body of work.

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

The key word **object** in this document is to be interpreted as an unordered data structure of key-value pairs, referred to in language systems by terms including, but not limited to, "object", "associative array", "hash map" and "key-value store". The term **property** or **attribute** in this document may be interpreted as synonymous with **key** to mean a reference within the object that returns a **value**.

The key word **netmask** (alternatively: **subnet mask**) in this document is to be interpreted as described the word "mask" by RFC 4632 ["Classless Inter-domain Routing (CIDR)"].

### Constituents

#### Engine

The `Engine` is a storage, querying and distribution routine that logically represents a node. 

The engine is responsive for:

1. Persistent storage of the node's relative ecosystem.
2. RESTful interfaces for managing payloads in the node's relative ecosystem.
3. RESTful interfaces for `AdjOutPeer` to query payloads from the node's relative ecosystem.
4. Scheduled job to query `AdjInPeer` RESTful interfaces to update the node's relative ecosystem.

#### AdjInPeer

An `AdjInPeer` is a peer that the `Engine` queries for payloads.

Information from an `AdjInPeer` is (1) processed through `AdjInFilter`, (2) stored within the `AdjIn` structure, (3) transformed by `AdjInTransform` and (4) finally delivered to `Local` for conveyance to outlets and propagation to `AdjOutPeer` nodes.

#### AdjOutPeer

An `AdjOutPeer` is a peer that the `Engine` allows to query it for payloads, both that originate from the node or that may have originated from one of node's peers and are flagged to be propagated.

Information from `Local` is (1) transformed by `AdjOutTransform`, (2) stored within the `AdjOut` structure, (3) processed through `AdjOutFilter` and (4) finally delivered via an HTTP response to a querying `AdjOutPeer` node.

#### Outlet

An outlet is an interface that delivers information based on the `Local` structure, represented as either a:

* `ManagerOutlet` used to manage payloads, filters and transforms within the `Engine`.
* `LocalOutlet` used as a configurable portal such as a tool launcher or mobile dashboard.

### Mechanisms

#### AdjInFilter

Payloads received from `AdjInPeer` nodes are dropped if they do not meet the constraints imposed by `AdjInFilter`.

These filters should be used to drop payloads that have requisites an organization does not support or that do not support something that the organization requires.  

If a payload meets the `AdjInFilter` constraints, then it will be entered into `AdjIn`.

#### AdjInTransform

Payloads from `AdjIn` are transformed via the `AdjInTransform` rules before they are entered into `Local`. 

This allows an organization to curate the way in which payloads are presented via outlets.

#### AdjOutTransform

Payloads from `Local` are transformed via the `AdjOutTransform` rules before they are entered into `AdjOut`. 

This allows an organization to curate the way in which payloads are presented to `AdjOutPeer` nodes.

#### AdjOutFilter

Payloads from `AdjOut` are dropped if they do not meet the constraints imposed by `AdjOutFilter`. 

These filters are typically used to drop payloads that will not be useful for other peers, such as those that have authorization restrictions. 

If a payload meets the `AdjOutFilter` constraints, then it will be provided in the response to queries from `AdjOutPeer` nodes.

### Data Structures

#### AdjIn

This structure contains payloads shared from or propagated through an `AdjInPeer` node, after being filtered by `AdjInFilter`.

#### Local

This structure contains payloads that either (1) originate directly from the node or (2) originate from an `AdjInPeer` node and shall have successfully passed through `AdjInFilter` and `AdjInTransform`.

#### AdjOut

This structure contains payloads that either (1) originate directly from the node or (2) were received from an `AdjInPeer` node and are marked for propagation. Payloads must be passed through `AdjOutFilter` before being entered into this structure.

Payloads in this structure may be made available by the `Engine` when queried by an `AdjOutPeer` node, contingent on the fact that payloads made available must first pass through `AdjOutFilter`.

## User Characteristics

### Pull-based Protocol

All communication between nodes is pull-based. This allows nodes to configure their own refresh and expiration policies regarding payloads.

### Transport Security

This protocol recommends that all RESTful web services minimally implement transport layer security as defined by RFC 2818 ["HTTP over TLS"]. This provides reasonable assurances toward the provenance and integrity of data delivered to and from peers.

### Payload Trust

The use of transport layer security does not ensure the validity of the contents contained within a payload. A malicious peer may propagate payloads that do not conform to this protocol. Consequently, trust is required between a node and its direct peers. Further, if a node accepts applications propagated through (rather than derived at) the `AdjInPeer`, then the node is implicitly trusting those indirect peers, or at least the representation provided by it's direct peer. Because this multi-hop trust may not always be desired, `AdjInFilter` may be used to only accept applications derived directly at the `AdjInPeer`.

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

All `Node` objects must define a `:name` property. This must be a unique name among all peers defined within the `Engine`.

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
    :netmask => String || undefined,
    :local   => false
  }
}
```

All `AdjOutPeer` objects must define an `:out` property (alternatively: `:out` object) containing an object that must include a `:local` property set to `false`. 

It is recommended that the `:out` property also contains an `:address` property with an IP address value. If the `:address` property is not defined, then the `Engine` shall respond to any request bearing the correct `:name` and `:secret`. Additionally, the `:out` property may include a `:netmask` property with an netmask value in the event that the `Engine` shall respond to any request issued by an `Outlet` within a subnet.

The `:out` object may be set in concurrence with an `:in` object to classify a peer as both an `AdjInPeer` and  an `AdjOutPeer`.

### Outlet

The `Outlet` object extends the `Node` object, specifying a peer to which the `Engine` will return a set of payloads from `Local`.

```ruby
{
  :name   => String,
  :secret   =>    String || undefined,
  :response =>    {
    :address  =>  String || undefined,
    :netmask  =>  String || undefined,
    :local    =>  true,
    :manage   =>  true || false || undefined
  }
}
```

All `Local` objects must define an `:out` property (alternatively: `:out` object) containing an object that must include a `:local` property set to `true`.

The `:out` property may include a `:manage` property, in which case the `Outlet` will be treated as a `ManagerOutlet`. A `ManagerOutlet` may issue mutator (POST, PUT and DELETE) requests against the `Engine` to modify data in `Local`, as well as to modify `AdjInFilter`, `AdjInTransform`, `AdjOutTransform` and `AdjOutFilter`. If the `:manage` property is false or undefined, then the `Outlet` will not have access to mutator requests.

The `:out` property may also contains an `:address` property with an IP address value. This is recommended for `ManagerOutlet` nodes. If the `:address` property is defined, the `Engine` shall respond to requests bearing the correct `:name` and `:secret` only if the requesting agent is from `:address`. Additionally, the `:out` property may include a `:netmask` property with a netmask value in the event that the `Engine` shall respond to any request issued by an `Outlet` within a subnet.

The `:out` object may be set in concurrence with an `:in` object to classify a peer as both an `AdjInPeer` and an `Outlet`.

The `:request` property may be concurrently set on a peer to make it both an `Outlet` and an `AdjInPeer`.

## Payload

A `payload` represents a URI and associated metadata.

```ruby
{
  :identity   =>  {
    :id           =>  String,
    :originator   =>  String
  },
  :original   =>  {
    # .. (original :attributes section)
  }
  :attributes =>  {
    :name      =>  String,
    :uri       =>  String,
    :share     =>  true || false || undefined,
    :propagate =>  true || false || undefined,
    :use       =>  {
        # .. (peers may process enclosed values during filtering) 
    } || undefined,
    :require   =>  {
        # .. (peers must process enclosed values during filtering) 
    } || undefined
  }
}
```

Minimally, a payload must include:

* an `:identity` property that must include `:id` and `:originator` properties
* an `:attributes` property that must include `:name` and `:uri` properties.

The `:attributes` object may additionally include:

* a `:share` property that, if true, may inform the `Engine` to share the payload with `AdjOutPeer` nodes.
* a `:propagate` property that, if true, may inform the `Engine` that the share bit may be set `true` if received from an `AdjInPeer`.

If either `:share` or `:propagate` is not set, the not set attribute must be assumed `false`. In combination, these two properties shall indicate whether a payload is intended for local use only, for sharing only from the originator to its directly adjacent peers, or for sharing throughout the network along multiple hops.

The `:attributes` object should also include:

* a `:use` object specifies metadata that a node may evaluate. If a node cannot evaluate an attribute within this object, it should not drop the payload at `AdjInFilter` unless a filter is defined explicitly to this effect.
* a `:require` object specifies metadata that a node must be able to evaluate. If a node cannot evaluate an attribute within this object, or if a node evaluates the metadata as not having the specified requirements, then it must drop the payload at `AdjInFilter`. 

If the `:originator` property does not correspond to the current node, the payload must also include:

* an `:original` property that contains the values of `:attributes` as defined by the originator

If the `:original` property is already set, it must not be modified.

### Properties for :use

All properties discussed in this section should be considered optional. Further, additional properties may be added into this structure on an ad hoc basis.

#### Example: Common Website Properties

**NON-NORMATIVE** This section is intended as an non-normative example of how the `:use` attribute might be implemented. It should not be regarded as part of the protocol at this time, and the very structure of the `:require` property here might change completely before final implementation.

Some common properties for the `payload[:attributes][:use]` object include:

```ruby
{
  # ..
  :attributes => {
    # ..
    :use => {
      :categories   => Array(String) || undefined,
      :tags         => Array(String) || undefined,
      :icon         => String || undefined,
      :capabilities => {
        :mobile     => true || false || undefined,
        :tablet     => true || false || undefined,
        :desktop    => true || false || undefined,
        :responsive => true || false || undefined
      }
      # ..
    }
  }
}
```

The `:categories` array may be used to define zero or more categories that an `Outlet` may provide in its interface to provide a taxonomy for payloads. The values in this array may be modified by `AdjInTransform` to fit the categories used by `Outlet` nodes, and further it may be modified by `AdjOutTransform` to fit categorical expectations `AdjOutPeer` nodes may expect.

The `:tags` array may be used to define zero or more keywords that an `Outlet` may provide in its interface to help search for payloads. Where categories are meant to define a taxonomy, tags are simply additional terms that may be helpful in describing a node. These may be modified similarly by `AdjInTransform` and `AdjOutTransform`, and they may also be used during `AdjInTransform` to advice on mapping a payload to categories that the node recognizes locally.

The `:icon` string is intended to represent an `img[src]` value. This may be either a traditional web accessible URL or a data scheme such as `data:image/png;base64,...`.

The `:capabilities` array is intended to provide a set of `true` or `false` values that represent things that a URI is capable of doing. The example above involves capabilities that specify whether payload is capable of supporting certain viewports or can responsively handle all viewports. These may be implemented, as may other capabilities not defined in the above example. Capabilities are useful for outlets such as a mobile dashboard, where it would not make sense to present a payload that only supports desktop viewports.

In a similar way, other capabilities such as an IMS Learning Tools Interoperability or W3C Packaged Web Apps launch might also be made available.

### Properties for :require

All properties discussed in this section should be considered optional. Further, additional properties may be added into this structure on an ad hoc basis. It should be noted, however, that if a `:require` property is introduced that a peer does not recognize, then the peer will drop the payload at `AdjInFilter`.

#### Example: Shibboleth

**NON-NORMATIVE** This section is intended as an non-normative example of how the `:require` attribute might be implemented. It should not be regarded as part of the protocol at this time, and the very structure of the `:require` property here might change completely before final implementation.

Shibboleth is a SAML-based middleware that supports federation.

If an application requires the InCommon Shibboleth federation for authorization, then it might be specified as such:

```ruby
{
  # ..
  :attributes => {
    # ..
    :require => {
      :shibboleth => {
        :incommon => true
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
  :attributes => {
    # ..
    :require => {
      :shibboleth => {
        :incommon => {
          :entityID => [
            'urn:mace:incommon:ucla.edu',
            'urn:mace:incommon:berkeley.edu',
            # ..
          ]
        }
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
  :attributes => {
    # ..
    :require => {
      :shibboleth => {
        :incommon => {
          :attributes => [
            # eduPerson Attribute:
            'urn:mace:dir:attribute-def:eduPersonPrincipalName',
            # UCTrust Attribute:
            'urn:oid:2.16.840.1.113916.1.1.4.1]',
            # ..
          ]
        }
      }
      # ..
    }
  }
}
```

In a similar way, other requirements such as an IMS Learning Tools Interoperability or W3C Packaged Web Apps launch might also be enforced.

# External Interfaces

## GET payloads

Returns an array of `Payload` objects. If the requesting agent is in `Outlet`, payloads are returned from `Local`, or if the requesting agent is in `AdjPeerOut`, payloads are returned from `AdjOut` through `AdjOutFilter`. 

An error response is thrown if the request agent is not a valid `Outlet` or `AdjOutPeer`.

### Request

```
GET /payloads?name=[name]&secret=[secret] HTTP/1.1
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
        "original" : {
            // .. (original :attributes section)
        }
        "attributes" : {
            // .. (node :attributes section)
        }
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

Creates a new `Payload` object JSON request body. This JSON request body should be solely the `attributes` values. This routine assigns `Payload[:identity]` internally and returns it back as part of the `200 Success` response. The `Payload[:original]` field is only added during delivery to `AdjOut` through `AdjOutTransform`. This allows for the `Engine` to determine which payloads are local, as they will not include a `Payload[:original]` attribute within `Local`.

An error response will be thrown if the request agent is not a valid `Outlet`.

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
    "identity": {
        "id"            :   String,
        "originator"    :   String
    },
    "attributes": {
        // attributes..
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

Updates an existing `Payload` object from the request body data if a payload currently exists with the same `Payload[:identity]`. The `Payload[:identity]` data must be included to identity the payload. `Payload[:attributes]` data must be included and shall completely overwrite the old version of `:attributes` per the HTTP PUT method definition. `Payload[:original]` data should not be included; if `Payload[:original]` is provided, the `Engine` must ignore it as this is unmutable data from its originator (or it won't exist at all if the payload was locally defined).

An error response will be thrown if the request agent is not a valid `Outlet`.

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
    }
}
```

### Response

#### 200 Success

```js
{
    "identity": {
        "id"            :   String,
        "originator"    :   String
    },
    "attributes": {
        // attributes..
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

#### 404 Not Found

```
Payload does not exist with identity. Use POST payloads instead.
```

## DELETE payloads

Deletes an existing `Payload` object from the request body data if a payload currently exists with the same `Payload[:identity]`.

An error response will be thrown if the request agent is not a valid `Outlet` or there is no payload with the specified identity.

### Request

```
DELETE /apps?name=[name]&secret=[secret] HTTP/1.1
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

### ALWAYS

```ruby
if payload[:attributes].has_key? :require
  drop Payload unless accepts? Payload[:attributes][:require]
end
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

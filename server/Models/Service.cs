using System;
using System.Collections.Generic;

namespace server.Models;

/// <summary>
/// A list of all the types of services the roofing company can provide to their customers.
/// </summary>
public partial class Service
{
    public long Id { get; set; }

    public string Name { get; set; } = null!;

    public string Description { get; set; } = null!;

    public DateTime? UpdatedAt { get; set; }

    public DateTime? CreatedAt { get; set; }

    /// <summary>
    /// Due to the fact that my services don&apos;t have a set price and requires a quote. We will store a default price for the service such as $300 per sq or $100 per hour. 
    /// </summary>
    public string? DefaultPrice { get; set; }

    public virtual ICollection<InvoiceLineService> InvoiceLineServices { get; set; } = new List<InvoiceLineService>();

    public virtual ICollection<Invoice> Invoices { get; set; } = new List<Invoice>();

    public virtual ICollection<QuoteLineItem> QuoteLineItems { get; set; } = new List<QuoteLineItem>();

    public virtual ICollection<QuoteRequest> QuoteRequests { get; set; } = new List<QuoteRequest>();

    public virtual ICollection<Quote> Quotes { get; set; } = new List<Quote>();
}

using System;
using System.Collections.Generic;

namespace server.Models;

/// <summary>
/// Table that stores all types of customer the roofing company deals with
/// </summary>
public partial class CustomerType
{
    public long Id { get; set; }

    public string Name { get; set; } = null!;

    public string Description { get; set; } = null!;

    public DateTime? UpdatedAt { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual ICollection<Customer> Customers { get; set; } = new List<Customer>();

    public virtual ICollection<QuoteRequest> QuoteRequests { get; set; } = new List<QuoteRequest>();
}

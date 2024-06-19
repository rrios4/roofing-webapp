using System;
using System.Collections.Generic;

namespace server.Models;

/// <summary>
/// Table that stores all the status for a estimate request submitted by the customer
/// </summary>
public partial class QuoteRequestStatus
{
    public long Id { get; set; }

    public string Name { get; set; } = null!;

    public string Description { get; set; } = null!;

    public DateTime? UpdatedAt { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual ICollection<QuoteRequest> QuoteRequests { get; set; } = new List<QuoteRequest>();
}

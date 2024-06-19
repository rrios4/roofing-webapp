using System;
using System.Collections.Generic;

namespace server.Models;

public partial class QuoteStatus
{
    public long Id { get; set; }

    public string? Name { get; set; }

    public string? Description { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual ICollection<Quote> Quotes { get; set; } = new List<Quote>();
}

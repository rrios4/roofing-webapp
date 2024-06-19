using System;
using System.Collections.Generic;
using System.Net;

namespace server.Models.Supabase;

/// <summary>
/// auth: stores metadata about challenge requests made
/// </summary>
public partial class MfaChallenge
{
    public Guid Id { get; set; }

    public Guid FactorId { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? VerifiedAt { get; set; }

    public IPAddress IpAddress { get; set; } = null!;

    public virtual MfaFactor Factor { get; set; } = null!;
}
